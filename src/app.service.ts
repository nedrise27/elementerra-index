import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import * as _ from 'lodash';
import { ParsedTransaction } from './dto/ParsedTransaction';
import { ElementsService } from './elements.service';
import { ForgeAttemptsService } from './forgeAttempts.service';
import { HeliusService } from './helius.service';
import {
  ForgeAttempt,
  TransactionHistory as TransactionHistoryModel,
} from './models';
import { ReplayResponse } from './responses/ReplayResponse';
import { StatsResponse } from './responses/StatsResponse';
import {
  ELEMENTERRA_PROGRAM_ADD_TO_PENDING_GUESS_DATA_PREFIX,
  ELEMENTERRA_PROGRAM_CLAIM_PENDING_GUESS_DATA,
} from './lib/constants';
import { Op } from 'sequelize';
import { ReplayElementsResponse } from './responses/ReplayElementsResponse';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(TransactionHistoryModel)
    private readonly transactionHistoryModel: typeof TransactionHistoryModel,
    @InjectModel(ForgeAttempt)
    private readonly forgeAttemptModel: typeof ForgeAttempt,
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

    const first = _.first(transactions);
    const last = _.last(transactions);

    return {
      firstTransaction: first?.signature,
      firstSlot: first?.slot,
      lastTransaction: last?.signature,
      lastSlot: last?.slot,
    };
  }

  public async replayForgeAttempts(
    limit?: number,
    guesser?: string,
    afterSlot?: number,
  ): Promise<ReplayResponse> {
    const l = limit || 1000;

    const innerWhere = {};

    if (!_.isNil(guesser) && !_.isEmpty(guesser)) {
      innerWhere['feePayer'] = guesser;
    }

    if (!_.isNil(afterSlot) && _.isNumber(afterSlot)) {
      innerWhere['slot'] = { [Op.gte]: afterSlot };
    }

    const where = {
      [Op.or]: [
        {
          ...innerWhere,
          containsClaimInstruction: true,
        },
        {
          ...innerWhere,
          containsAddToPendingGuessInstruction: true,
        },
      ],
    };

    const transactions = await this.transactionHistoryModel.findAll({
      where,
      order: [['slot', 'asc']],
      limit: l,
    });

    let claims = 0;
    let adds = 0;

    for (const tx of transactions) {
      if (tx.dataValues.containsClaimInstruction) {
        claims++;
        await this.forgeAttemptsService.processClaimPendingGuessTransaction(tx);
      } else if (tx.dataValues.containsAddToPendingGuessInstruction) {
        adds++;
        await this.forgeAttemptsService.processAddToPendingGuessTransaction(tx);
      }
    }

    console.log(
      `Processed ${claims} ClaimPendingGuess and ${adds} AddToPendingGuess transactions`,
    );

    const first = _.first(transactions);
    const last = _.last(transactions);

    return {
      firstTransaction: first?.tx,
      firstSlot: first?.slot,
      lastTransaction: last?.tx,
      lastSlot: last?.slot,
    };
  }

  private async handleTransaction(
    parsedTransaction: ParsedTransaction,
  ): Promise<void> {
    await Promise.all([
      this.saveTransactionHistory(parsedTransaction),
      this.elementsService.processTransaction(parsedTransaction),
    ]);

    await this.forgeAttemptsService.processTransaction(
      parsedTransaction.signature,
    );
  }

  private async saveTransactionHistory(parsedTransaction: ParsedTransaction) {
    const containsClaimInstruction = !_.isNil(
      parsedTransaction.instructions.find(
        (ix) => ix.data === ELEMENTERRA_PROGRAM_CLAIM_PENDING_GUESS_DATA,
      ),
    );
    const containsAddToPendingGuessInstruction = !_.isNil(
      parsedTransaction.instructions.find((ix) =>
        ix.data.startsWith(
          ELEMENTERRA_PROGRAM_ADD_TO_PENDING_GUESS_DATA_PREFIX,
        ),
      ),
    );
    const transactionError = !_.isNil(parsedTransaction?.transactionError);

    try {
      await this.transactionHistoryModel.upsert({
        tx: parsedTransaction.signature,
        timestamp: parsedTransaction.timestamp,
        slot: parsedTransaction.slot,
        feePayer: parsedTransaction.feePayer,
        containsClaimInstruction,
        containsAddToPendingGuessInstruction,
        transactionError,
        data: parsedTransaction,
      });
    } catch (err) {
      console.error(`Error while saving transaction: ${err}`);
    }
  }

  public async replayElements(
    limit?: number,
    page?: number,
  ): Promise<ReplayElementsResponse> {
    return this.elementsService.replay(limit, page);
  }
}
