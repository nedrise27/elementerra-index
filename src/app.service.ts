import { Get, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InjectModel as InjectObjectModel } from '@nestjs/mongoose';

import { Element, ForgeAttempt } from './models';
import { TransactionHistory } from './schemas/ProgramTransactionHistory.schema';
import { Model } from 'mongoose';
import { HeliusWebhookTransactionItem } from './dto/HeliusWebhookTransactionItem';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(ForgeAttempt)
    private readonly forgeAttemptModel: typeof ForgeAttempt,
    @InjectModel(Element)
    private readonly elementModel: typeof Element,
    @InjectObjectModel(TransactionHistory.name)
    private readonly transactionHistoryModel: Model<TransactionHistory>,
  ) {}

  async stats() {
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

  async saveProgramTransactionHistory(
    transactionHistory: HeliusWebhookTransactionItem[],
  ) {
    for (const data of transactionHistory) {
      const t = new this.transactionHistoryModel({
        tx: data.signature,
        timestamp: data.timestamp,
        slot: data.slot,
        data,
      });
      t.save();
    }

    return;
  }
}
