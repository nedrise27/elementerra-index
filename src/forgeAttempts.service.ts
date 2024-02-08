import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as _ from 'lodash';
import { Op, Order } from 'sequelize';
import { CompressedEvent } from './dto/ParsedTransaction';
import { ElementsService } from './elements.service';
import {
  ADD_TO_PENDING_GUESS_COUNT,
  ELEMENTERRA_ELEMENTS_TREE_ID,
} from './lib/constants';
import { Element, ForgeAttempt, TransactionHistory } from './models';

@Injectable()
export class ForgeAttemptsService {
  constructor(
    @InjectModel(TransactionHistory)
    private readonly transactionHistoryModel: typeof TransactionHistory,
    @InjectModel(ForgeAttempt)
    private readonly forgeAttemptModel: typeof ForgeAttempt,
    @InjectModel(Element)
    private readonly elementModel: typeof Element,
    private readonly elementsService: ElementsService,
  ) {}

  public async findOne(tx: string): Promise<ForgeAttempt | undefined> {
    return this.forgeAttemptModel.findOne({
      include: [Element],
      where: { tx },
    });
  }

  public async findAll(
    limit: number,
    offset: number,
    order: string,
    guesser?: string,
    beforeTimestamp?: number,
  ): Promise<ForgeAttempt[]> {
    const defaultOrder: Order = [['slot', order]];

    const query = {
      include: [Element],
      limit,
      offset,
      order: defaultOrder,
    };
    if (!_.isNil(guesser)) {
      query['where'] = { guesser };
    }
    if (!_.isNil(beforeTimestamp)) {
      query['where'] = {
        ...query['where'],
        timestamp: { [Op.lt]: beforeTimestamp },
      };
    }

    return this.forgeAttemptModel.findAll(query);
  }

  public async processTransaction(tx: string): Promise<void> {
    try {
      const transaction = await this.transactionHistoryModel.findOne({
        where: { tx },
      });

      if (_.isNil(transaction)) {
        console.error(
          `Could not find transaction ${tx} in our transaction history`,
        );
        return;
      }

      if (transaction.containsClaimInstruction) {
        await this.processClaimPendingGuessTransaction(transaction);
      }

      if (transaction.containsAddToPendingGuessInstruction) {
        await this.processAddToPendingGuessTransaction(transaction);
      }
    } catch (err) {
      console.error(`Error while processing transaction ${tx}. Error: ${err}`);
    }
  }

  public async processAddToPendingGuessTransaction(
    transaction: TransactionHistory,
  ) {
    const compressedEvents: CompressedEvent[] | undefined = _.get(
      transaction.data.events,
      'compressed',
    );

    if (_.isNil(compressedEvents) || _.isEmpty(compressedEvents)) {
      console.error(
        `Could not find compressed event for AddToPendingGuess transaction ${transaction.tx}`,
      );
      return;
    }

    const elementId = compressedEvents?.find(
      (e) => e.treeId === ELEMENTERRA_ELEMENTS_TREE_ID,
    )?.assetId;

    if (_.isNil(elementId)) {
      console.error(
        `Could not find elementId for AddToPendingGuess transaction ${transaction.tx}`,
      );
      return;
    }

    await this.elementsService.findOrFetchAndSaveElement(elementId);
  }

  public async processClaimPendingGuessTransaction(
    transaction: TransactionHistory,
  ) {
    const tx = transaction.tx;
    const timestamp = transaction.timestamp;
    const slot = transaction.slot;
    const guesser = transaction.feePayer;

    // if no chest was given => failed
    let hasFailed = _.isNil(
      transaction.data.tokenTransfers.find((t) => t.toUserAccount === guesser),
    );

    // if not element was given => failed
    const compressedEvents: CompressedEvent[] | undefined = _.get(
      transaction.data.events,
      'compressed',
    );
    if (hasFailed && !_.isNil(compressedEvents)) {
      hasFailed = _.isNil(
        compressedEvents.find((e) => e.newLeafOwner === guesser),
      );
    }

    const addToPendingGuessTransactions =
      await this.getAddToPendingGuessForClaim(transaction);

    if (
      !_.isNil(addToPendingGuessTransactions) &&
      !_.isEmpty(addToPendingGuessTransactions)
    ) {
      const addToPendingGuesses = addToPendingGuessTransactions.map(
        (a) => a.tx,
      );

      await this.forgeAttemptModel.upsert({
        tx,
        timestamp,
        slot,
        guesser,
        hasFailed,
        addToPendingGuesses,
      });

      const elementIds = addToPendingGuessTransactions.map(
        (a) =>
          a.data.events?.compressed?.find((e) => !_.isNil(e.assetId)).assetId,
      );

      await this.elementModel.update(
        { forgeAttemptTx: tx },
        {
          where: {
            id: { [Op.in]: elementIds },
          },
        },
      );
    }
  }

  // Get all AddToPendingGuess transactions between this claim and the one before if exists for the same guesser
  // If we find exacly four AddToPendingGuess transactions return them
  private async getAddToPendingGuessForClaim(
    claimTransaction: TransactionHistory,
  ): Promise<TransactionHistory[] | undefined> {
    const guesser = claimTransaction.feePayer;
    const claimSlot = claimTransaction.slot;

    const claimBefore = await this.transactionHistoryModel.findOne({
      where: {
        feePayer: claimTransaction.dataValues.feePayer,
        containsClaimInstruction: true,
        slot: { [Op.lt]: claimSlot },
      },
      order: [['slot', 'desc']],
      limit: 1,
    });

    const where = {
      feePayer: guesser,
      containsAddToPendingGuessInstruction: true,
    };

    if (!_.isNil(claimBefore)) {
      where['slot'] = {
        [Op.and]: [
          { [Op.lte]: claimSlot, [Op.gt]: claimBefore.dataValues.slot },
        ],
      };
    } else {
      where['slot'] = {
        [Op.lte]: claimSlot,
      };
    }

    const addToPendingGuessTransactions =
      await this.transactionHistoryModel.findAll({
        where,
        order: [['slot', 'desc']],
        limit: 4,
      });

    if (addToPendingGuessTransactions.length !== ADD_TO_PENDING_GUESS_COUNT) {
      console.error(
        `Found ${addToPendingGuessTransactions.length} AddToPendingGuess transactions but expected ${ADD_TO_PENDING_GUESS_COUNT} for ClaimPendingGuess transaction ${claimTransaction.dataValues.tx} at slot ${claimTransaction.dataValues.slot}`,
      );
      return;
    }

    return addToPendingGuessTransactions;
  }
}
