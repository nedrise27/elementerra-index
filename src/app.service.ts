import { Injectable } from '@nestjs/common';
import { InjectModel as InjectObjectModel } from '@nestjs/mongoose';
import { InjectModel } from '@nestjs/sequelize';

import * as _ from 'lodash';
import { Model } from 'mongoose';
import { ParsedTransaction } from './dto/ParsedTransaction';
import { ElementsService } from './elements.service';
import { ForgeAttemptsService } from './forgeAttempts.service';
import { HeliusService } from './helius.service';
import { ForgeAttempt } from './models';
import { ReplayResponse } from './responses/ReplayResponse';
import { StatsResponse } from './responses/StatsResponse';
import { TransactionHistory } from './schemas/TransactionHistory.schema';
import {
  ELEMENTERRA_PROGRAM_ADD_TO_PENDING_GUESS_DATA_PREFIX,
  ELEMENTERRA_PROGRAM_CLAIM_PENDING_GUESS_DATA,
} from './lib/constants';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(ForgeAttempt)
    private readonly forgeAttemptModel: typeof ForgeAttempt,
    @InjectObjectModel(TransactionHistory.name)
    private readonly transactionHistoryModel: Model<TransactionHistory>,
    private readonly forgeAttemptsService: ForgeAttemptsService,
    private readonly elementsService: ElementsService,
    private readonly heliusService: HeliusService,
  ) {}

  public async stats(): Promise<StatsResponse> {
    const forgeAttemptCount = await this.forgeAttemptModel.count();
    const successfulForgeAttemptsCount = await this.forgeAttemptModel.count({
      where: {
        hasFailed: false,
      },
    });
    const unsuccessfulForgeAttemptsCount =
      forgeAttemptCount - successfulForgeAttemptsCount;

    return {
      forgeAttemptCount,
      successfulForgeAttemptsCount,
      unsuccessfulForgeAttemptsCount,
    };
  }

  public async processTransactionHistory(
    transactionHistory: ParsedTransaction[] | ParsedTransaction,
  ) {
    if (_.isArray(transactionHistory)) {
      for (const parsedTransaction of transactionHistory) {
        await this.handleTransaction(parsedTransaction);
      }
    } else {
      await this.handleTransaction(transactionHistory);
    }
  }

  public async replay(
    guesser: string,
    before?: string,
    type?: string,
  ): Promise<ReplayResponse> {
    const limit = 100;

    const transactions = await this.heliusService.getSignaturesForAddress(
      guesser,
      limit,
      before,
      type,
    );

    await this.processTransactionHistory(transactions);

    const last = _.last(transactions);

    return {
      lastTransaction: last?.signature,
      lastSlot: last.slot,
    };
  }

  public async replayForgeAttempts(
    limit?: number,
    guesser?: string,
    beforeSlot?: number,
  ): Promise<ReplayResponse> {
    const l = limit || 1000;

    const query = {};

    if (!_.isNil(guesser) && !_.isEmpty(guesser)) {
      query['data.feePayer'] = guesser;
    }

    if (!_.isNil(beforeSlot) && _.isNumber(beforeSlot)) {
      query['slot'] = { $lte: beforeSlot };
    }

    const transactions = await this.transactionHistoryModel
      .find(query)
      .sort({ slot: -1 })
      .limit(l);

    await Promise.all(
      transactions.map((tx) =>
        this.forgeAttemptsService.processTransaction(
          tx.data as ParsedTransaction,
        ),
      ),
    );

    const last = _.last(transactions);

    return {
      lastTransaction: last?.tx,
      lastSlot: last.slot,
    };
  }

  private async handleTransaction(
    parsedTransaction: ParsedTransaction,
  ): Promise<void> {
    await Promise.all([
      this.saveTransactionHistory(parsedTransaction),
      // this.forgeAttemptsService.processTransaction(parsedTransaction),
      this.elementsService.processTransaction(parsedTransaction),
    ]);
  }

  private async saveTransactionHistory(parsedTransaction: ParsedTransaction) {
    const containsClaimInstruction = parsedTransaction.instructions.find(
      (ix) => ix.data === ELEMENTERRA_PROGRAM_CLAIM_PENDING_GUESS_DATA,
    );
    const containsAddToPendingGuessInstruction =
      parsedTransaction.instructions.find((ix) =>
        ix.data.startsWith(
          ELEMENTERRA_PROGRAM_ADD_TO_PENDING_GUESS_DATA_PREFIX,
        ),
      );

    return this.transactionHistoryModel.findOneAndUpdate(
      { tx: parsedTransaction.signature },
      {
        tx: parsedTransaction.signature,
        timestamp: parsedTransaction.timestamp,
        slot: parsedTransaction.slot,
        feePayer: parsedTransaction.feePayer,
        containsClaimInstruction,
        containsAddToPendingGuessInstruction,
        data: parsedTransaction,
      },
      { upsert: true },
    );
  }
}
