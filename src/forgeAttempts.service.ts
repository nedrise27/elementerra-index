import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel as InjectObjectModel } from '@nestjs/mongoose';
import { InjectModel } from '@nestjs/sequelize';
import * as _ from 'lodash';
import { Model } from 'mongoose';
import { Op, Order } from 'sequelize';
import { CompressedEvent, ParsedTransaction } from './dto/ParsedTransaction';
import { ElementsService } from './elements.service';
import {
  ADD_TO_PENDING_GUESS_COUNT,
  ELEMENTERRA_ELEMENTS_TREE_ID,
  ELEMENTERRA_PROGRAMM_ID,
  ELEMENTERRA_PROGRAM_ADD_TO_PENDING_GUESS_DATA_PREFIX,
  ELEMENTERRA_PROGRAM_CLAIM_PENDING_GUESS_DATA,
} from './lib/constants';
import { Element, ForgeAttempt } from './models';
import { TransactionHistory } from './schemas/TransactionHistory.schema';

@Injectable()
export class ForgeAttemptsService {
  constructor(
    @InjectModel(ForgeAttempt)
    private readonly forgeAttemptModel: typeof ForgeAttempt,
    @InjectModel(Element)
    private readonly elementModel: typeof Element,
    @InjectObjectModel(TransactionHistory.name)
    private readonly transactionHistoryModel: Model<TransactionHistory>,
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

  public async processTransaction(
    transaction: ParsedTransaction,
  ): Promise<void> {
    if (!_.isNil(transaction.transactionError)) {
      return;
    }

    if (_.isNil(transaction.signature)) {
      throw new InternalServerErrorException(
        'Could not get signature from transaction',
      );
    }

    const elementerraInstructions = transaction.instructions.filter(
      (i) => i.programId === ELEMENTERRA_PROGRAMM_ID,
    );

    for (const elementerraInstruction of elementerraInstructions) {
      if (
        elementerraInstruction.data ===
        ELEMENTERRA_PROGRAM_CLAIM_PENDING_GUESS_DATA
      ) {
        await this.processClaimPendingGuessTransaction(transaction);
      } else if (
        elementerraInstruction.data.startsWith(
          ELEMENTERRA_PROGRAM_ADD_TO_PENDING_GUESS_DATA_PREFIX,
        )
      ) {
        await this.processAddToPendingGuessTransaction(transaction);
      }
    }
  }

  private async processAddToPendingGuessTransaction(
    transaction: ParsedTransaction,
  ) {
    const compressedEvents: CompressedEvent[] | undefined = _.get(
      transaction.events,
      'compressed',
    );

    const elementId = compressedEvents?.find(
      (e) => e.treeId === ELEMENTERRA_ELEMENTS_TREE_ID,
    )?.assetId;

    await this.elementsService.findOrFetchAndSaveElement(elementId);
  }

  private async processClaimPendingGuessTransaction(
    transaction: ParsedTransaction,
  ) {
    const tx = transaction.signature;
    const timestamp = transaction.timestamp;
    const slot = transaction.slot;
    const guesser = transaction.feePayer;

    // if no chest was given => failed
    let hasFailed = _.isNil(
      transaction.tokenTransfers.find((t) => t.toUserAccount === guesser),
    );
    // if not element was given => failed
    const compressedEvents: CompressedEvent[] | undefined = _.get(
      transaction.events,
      'compressed',
    );
    if (hasFailed && !_.isNil(compressedEvents)) {
      hasFailed = _.isNil(
        compressedEvents.find((e) => e.newLeafOwner === guesser),
      );
    }

    await this.forgeAttemptModel.upsert({
      tx,
      timestamp,
      slot,
      guesser,
      hasFailed,
    });

    const addToPendingGuessTransactions =
      await this.getAddToPendingGuessForClaim(transaction);

    if (
      !_.isNil(addToPendingGuessTransactions) &&
      !_.isEmpty(addToPendingGuessTransactions)
    ) {
      const addToPendingGuessTxs = addToPendingGuessTransactions.map(
        (a) => a.tx,
      );

      await this.forgeAttemptModel.update(
        { addToPendingGuessTxs },
        {
          where: {
            tx,
          },
        },
      );

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

  // Get all AddToPendingGuess transactions between this claim and the one before for the same guesser
  // If we find exacly four AddToPendingGuess transactions return them
  private async getAddToPendingGuessForClaim(
    claimTransaction: ParsedTransaction,
  ): Promise<TransactionHistory[] | undefined> {
    const guesser = claimTransaction.feePayer;
    const claimSlot = claimTransaction.slot;

    const before = await this.transactionHistoryModel
      .findOne({
        'data.feePayer': guesser,
        'data.instructions.data': ELEMENTERRA_PROGRAM_CLAIM_PENDING_GUESS_DATA,
        slot: { $lt: claimSlot },
        limit: 1,
      })
      .sort({ slot: -1 })
      .limit(1);

    const slotQuery = {
      slot: { $lte: claimSlot },
    };
    if (!_.isNil(before)) {
      slotQuery.slot['$gte'] = before.slot;
    }

    const query = {
      'data.feePayer': guesser,
      'data.instructions.data': {
        $regex: `^${ELEMENTERRA_PROGRAM_ADD_TO_PENDING_GUESS_DATA_PREFIX}`,
      },
      ...slotQuery,
    };

    const addToPendingGuessTransactions = await this.transactionHistoryModel
      .find(query)
      .sort({ slot: -1 })
      .limit(4);

    if (addToPendingGuessTransactions.length !== ADD_TO_PENDING_GUESS_COUNT) {
      console.error(
        `Found ${addToPendingGuessTransactions.length} AddToPendingGuess transactions but expected ${ADD_TO_PENDING_GUESS_COUNT} for ClaimPendingGuess transaction ${claimTransaction.signature} at slot ${claimTransaction.slot}`,
      );
      return;
    }

    return addToPendingGuessTransactions;
  }
}
