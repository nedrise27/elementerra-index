import { Injectable } from '@nestjs/common';
import { InjectModel as InjectObjectModel } from '@nestjs/mongoose';
import { InjectModel } from '@nestjs/sequelize';

import * as _ from 'lodash';
import { Model } from 'mongoose';
import { ParsedTransaction } from './dto/ParsedTransaction';
import { ForgeAttemptsService } from './forgeAttempts.service';
import { Element, ForgeAttempt } from './models';
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
  ) {}

  public async stats() {
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
        this.handleTransaction(parsedTransaction);
      }
      return;
    }

    this.handleTransaction(transactionHistory);
    return;
  }

  private async handleTransaction(
    parsedTransaction: ParsedTransaction,
  ): Promise<void> {
    const t = new this.transactionHistoryModel({
      tx: parsedTransaction.signature,
      timestamp: parsedTransaction.timestamp,
      slot: parsedTransaction.slot,
      parsedTransaction,
    });
    t.save();

    this.forgeAttemptsService.processTransaction(parsedTransaction);
  }
}
