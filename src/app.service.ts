import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PublicKey } from '@solana/web3.js';
import { Guess } from 'clients/elementerra-program/accounts';
import * as _ from 'lodash';
import { Op } from 'sequelize';
import { ParsedTransaction } from './dto/ParsedTransaction';
import { ElementsService } from './elements.service';
import { ForgeAttemptsService } from './forgeAttempts.service';
import { HeliusService } from './helius.service';
import {
  ELEMENTERRA_PROGRAM_ADD_TO_PENDING_GUESS_DATA_PREFIX,
  ELEMENTERRA_PROGRAM_CLAIM_PENDING_GUESS_DATA,
} from './lib/constants';
import {
  ForgeAttempt,
  TransactionHistory as TransactionHistoryModel,
} from './models';
import { RecipesService } from './recipes.service';
import { ReplayElementsResponse } from './responses/ReplayElementsResponse';
import { ReplayResponse } from './responses/ReplayResponse';
import { StatsResponse } from './responses/StatsResponse';
import { GuessModel } from './models/Guess.model';
import { ReplayRecipesRequest } from './requests/ReplayRecipesRequest';
import { EnrichedTransaction } from 'helius-sdk';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(TransactionHistoryModel)
    private readonly transactionHistoryModel: typeof TransactionHistoryModel,
    @InjectModel(ForgeAttempt)
    private readonly forgeAttemptModel: typeof ForgeAttempt,
    private readonly forgeAttemptsService: ForgeAttemptsService,
    private readonly elementsService: ElementsService,
    private readonly recipesService: RecipesService,
    private readonly heliusService: HeliusService,
  ) {}

  public async stats(): Promise<StatsResponse> {
    const forgeAttemptCount = await this.forgeAttemptModel.count();
    const successfulForgeAttemptsCount = await this.forgeAttemptModel.count({
      where: {
        hasFailed: false,
      },
    });
    const unsuccessfulForgeAttemptsCount = await this.forgeAttemptModel.count({
      where: {
        hasFailed: true,
      },
    });

    const response = {
      forgeAttemptCount,
      successfulForgeAttemptsCount,
      unsuccessfulForgeAttemptsCount,
    };

    return response;
  }

  public async processTransactionHistory(
    transactionHistory: EnrichedTransaction[] | EnrichedTransaction,
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

    transactions.reverse();

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
    const l = _.min([limit, 100]);

    const where = {
      containsClaimInstruction: true,
    };

    if (!_.isNil(guesser) && !_.isEmpty(guesser)) {
      where['feePayer'] = guesser;
    }

    if (!_.isNil(afterSlot) && _.isNumber(afterSlot)) {
      where['slot'] = { [Op.gte]: afterSlot };
    }
    const transactions = await this.transactionHistoryModel.findAll({
      where,
      order: [['slot', 'asc']],
      limit: l,
    });

    const guessAddresses = transactions.map((tx) => {
      const claimInstruction = tx.data.instructions.find(
        (ix) => ix.data === ELEMENTERRA_PROGRAM_CLAIM_PENDING_GUESS_DATA,
      );
      return new PublicKey(claimInstruction.accounts[12]);
    });

    const guesses = await Guess.fetchMultiple(
      this.heliusService.connection,
      guessAddresses,
    );

    if (transactions.length !== guesses.length) {
      throw new InternalServerErrorException(
        `Got ${transactions.length} claim transactions and only found ${guesses.length} guesses`,
      );
    }

    await Promise.all(
      _.zip(transactions, guessAddresses, guesses).map(
        ([tx, guessAddress, guess]) => {
          const guessModel = GuessModel.fromGuess(
            guessAddress.toString(),
            guess,
          );
          return this.forgeAttemptsService.processTransactionAndGuess(
            tx,
            guessAddress.toString(),
            guessModel,
          );
        },
      ),
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

  public async replayElements(
    limit?: number,
    page?: number,
  ): Promise<ReplayElementsResponse> {
    return this.elementsService.replay(limit, page);
  }

  public async replayRecipes(request?: ReplayRecipesRequest): Promise<void> {
    return this.recipesService.replay(request?.season);
  }

  private async handleTransaction(
    parsedTransaction: EnrichedTransaction,
  ): Promise<void> {
    const [transactionHistory] = await Promise.all([
      this.saveTransactionHistory(parsedTransaction),
      this.elementsService.processTransaction(parsedTransaction),
    ]);

    if (
      !_.isNil(transactionHistory) &&
      transactionHistory.containsClaimInstruction
    ) {
      this.forgeAttemptsService.processTransaction(transactionHistory);
    }
  }

  private async saveTransactionHistory(
    parsedTransaction: EnrichedTransaction,
  ): Promise<TransactionHistoryModel | undefined> {
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
      const [transactionHistory] = await this.transactionHistoryModel.upsert({
        tx: parsedTransaction.signature,
        timestamp: parsedTransaction.timestamp,
        slot: parsedTransaction.slot,
        feePayer: parsedTransaction.feePayer,
        containsClaimInstruction,
        containsAddToPendingGuessInstruction,
        transactionError,
        data: parsedTransaction,
      });

      return transactionHistory;
    } catch (err) {
      console.error(`Error while saving transaction: ${err}`);
    }
  }
}
