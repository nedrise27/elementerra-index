import { Injectable } from '@nestjs/common';
import { InjectModel as InjectObjectModel } from '@nestjs/mongoose';
import { InjectModel } from '@nestjs/sequelize';

import * as _ from 'lodash';
import { Model } from 'mongoose';
import { ParsedTransaction } from './dto/ParsedTransaction';
import { ElementsService } from './elements.service';
import { ForgeAttemptsService } from './forgeAttempts.service';
import { Element, ForgeAttempt } from './models';
import { StatsResponse } from './responses/StatsResponse';
import { TransactionHistory } from './schemas/ProgramTransactionHistory.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(ForgeAttempt)
    private readonly forgeAttemptModel: typeof ForgeAttempt,
    @InjectModel(Element)
    private readonly elementModel: typeof Element,
    @InjectObjectModel(TransactionHistory.name)
    private readonly transactionHistoryModel: Model<TransactionHistory>,
    private readonly forgeAttemptsService: ForgeAttemptsService,
    private readonly elementsService: ElementsService,
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

  public async saveProgramTransactionHistory(
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

  public async saveElementTransactionHistory(
    transactionHistory: ParsedTransaction[] | ParsedTransaction,
  ) {
    if (_.isArray(transactionHistory)) {
      for (const parsedTransaction of transactionHistory) {
        await this.handleElement(parsedTransaction);
      }
    } else {
      await this.handleElement(transactionHistory);
    }
  }

  private async handleTransaction(
    parsedTransaction: ParsedTransaction,
  ): Promise<void> {
    await Promise.all([
      this.saveTransactionHistory(parsedTransaction),
      this.forgeAttemptsService.processTransaction(parsedTransaction),
    ]);
  }

  private async handleElement(parsedTransaction: ParsedTransaction) {
    await Promise.all([
      this.saveTransactionHistory(parsedTransaction),
      this.elementsService.processTransaction(parsedTransaction),
    ]);
  }

  private async saveTransactionHistory(parsedTransaction: ParsedTransaction) {
    return this.transactionHistoryModel.findOneAndUpdate(
      { tx: parsedTransaction.signature },
      {
        tx: parsedTransaction.signature,
        timestamp: parsedTransaction.timestamp,
        slot: parsedTransaction.slot,
        data: parsedTransaction,
      },
      { upsert: true },
    );
  }
}
