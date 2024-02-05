import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as _ from 'lodash';
import { Op, Order } from 'sequelize';
import { CompressedEvent, ParsedTransaction } from './dto/ParsedTransaction';
import { ElementsService } from './elements.service';
import { HeliusService } from './helius.service';
import {
  ADD_TO_PENDING_GUESS_COUNT,
  ELEMENTERRA_ELEMENTS_TREE_ID,
  ELEMENTERRA_PROGRAMM_ID,
  ELEMENTERRA_PROGRAM_ADD_TO_PENDING_GUESS_DATA_PREFIX,
  ELEMENTERRA_PROGRAM_CLAIM_PENDING_GUESS_DATA,
} from './lib/constants';
import { Element, ForgeAttempt } from './models';
import { AddToPendingGuess } from './models/AddToPendingGuess.model';
@Injectable()
export class ForgeAttemptsService {
  constructor(
    @InjectModel(ForgeAttempt)
    private readonly forgeAttemptModel: typeof ForgeAttempt,
    @InjectModel(AddToPendingGuess)
    private readonly addToPendingGuessModel: typeof AddToPendingGuess,
    @InjectModel(Element)
    private readonly elementModel: typeof Element,
    private readonly elementsService: ElementsService,
    private readonly heliusService: HeliusService,
  ) {}

  public async findAll(
    limit: number,
    offset: number,
    guesser?: string,
  ): Promise<ForgeAttempt[]> {
    const defaultOrder: Order = [['slot', 'desc']];

    const query = {
      include: [Element, AddToPendingGuess],
      limit,
      offset,
      order: defaultOrder,
    };
    if (!_.isNil(guesser)) {
      query['where'] = { guesser };
    }

    return this.forgeAttemptModel.findAll(query);
  }

  public async replay(guesser: string) {
    const limit = 100;
    let before: string | undefined;

    const transactions = await this.heliusService.getSignaturesForOwner(
      guesser,
      limit,
      before,
    );

    for (const transaction of transactions) {
      await this.processTransaction(transaction);
    }
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
    const tx = transaction.signature;
    const timestamp = transaction.timestamp;
    const slot = transaction.slot;
    const guesser = transaction.feePayer;

    const compressedEvents: CompressedEvent[] | undefined = _.get(
      transaction.events,
      'compressed',
    );

    const elementId = compressedEvents?.find(
      (e) => e.treeId === ELEMENTERRA_ELEMENTS_TREE_ID,
    )?.assetId;

    const foundElement =
      await this.elementsService.findOrFetchAndSaveElement(elementId);
    let forgeAttemptTx: string | undefined;

    if (!_.isNil(foundElement?.forgeAttemptTx)) {
      console.log('FOUND CLAIM TX');
      forgeAttemptTx = foundElement.forgeAttemptTx;
    }

    await this.addToPendingGuessModel.upsert({
      tx,
      timestamp,
      slot,
      guesser,
      elementId,
      forgeAttemptTx,
    });
  }

  private async processClaimPendingGuessTransaction(
    transaction: ParsedTransaction,
  ) {
    console.log('PROCESS CLAIM_PENDING_GUESS TRANSACTION');
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
        (a) => a.dataValues.tx,
      );
      await this.addToPendingGuessModel.update(
        {
          forgeAttemptTx: tx,
        },
        {
          where: {
            tx: { [Op.in]: addToPendingGuessTxs },
          },
        },
      );
      const elementIds = addToPendingGuessTransactions.map(
        (a) => a.dataValues.elementId,
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
  // If we find exacly four AddToPendingGuess transactions retrun them
  private async getAddToPendingGuessForClaim(
    claimTransaction: ParsedTransaction,
  ): Promise<AddToPendingGuess[] | undefined> {
    const guesser = claimTransaction.feePayer;
    const claimTimestamp = claimTransaction.timestamp;

    const before = await this.forgeAttemptModel.findOne({
      where: {
        guesser,
        timestamp: { [Op.lt]: claimTimestamp },
      },
      order: [['slot', 'desc']],
      limit: 1,
    });
    if (_.isNil(before)) {
      return;
    }

    const addToPendingGuessTransactions =
      await this.addToPendingGuessModel.findAndCountAll({
        where: {
          guesser,
          timestamp: {
            [Op.lt]: claimTimestamp,
            [Op.gt]: before.dataValues.timestamp,
          },
        },
      });

    if (addToPendingGuessTransactions.count !== ADD_TO_PENDING_GUESS_COUNT) {
      console.log(
        `Found ${addToPendingGuessTransactions.count} AddToPendingGuess transactions but expected ${ADD_TO_PENDING_GUESS_COUNT} for ClaimToPendingGuess transaction ${claimTransaction.signature} at slot ${claimTransaction.slot}`,
      );
      return;
    }

    return addToPendingGuessTransactions.rows;
  }
}
