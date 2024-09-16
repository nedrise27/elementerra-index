import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PublicKey } from '@solana/web3.js';
import { Guess } from 'clients/elementerra-program/accounts';
import * as _ from 'lodash';
import { Op, Order } from 'sequelize';
import { EventsService } from './events.service';
import { HeliusService } from './helius.service';
import { ELEMENTERRA_PROGRAM_CLAIM_PENDING_GUESS_DATA } from './lib/constants';
import { EventTopics } from './lib/events';
import { asyncSleep } from './lib/util';
import { ForgeAttempt, TransactionHistory } from './models';
import { GuessModel } from './models/Guess.model';
import { RecipesService } from './recipes.service';
import { ForgeAttemptResponse } from './responses/ForgeAttemptResponse';

@Injectable()
export class ForgeAttemptsService {
  constructor(
    @InjectModel(ForgeAttempt)
    private readonly forgeAttemptModel: typeof ForgeAttempt,
    private readonly recipesService: RecipesService,
    private readonly eventsService: EventsService,
  ) {}

  public async findOne(tx: string): Promise<ForgeAttemptResponse | undefined> {
    const foundForgeAttempt = await this.forgeAttemptModel.findOne({
      where: { tx },
    });

    return new ForgeAttemptResponse(foundForgeAttempt);
  }

  public async findAll(
    limit: number,
    offset: number,
    order: string,
    guesser?: string,
    beforeTimestamp?: number,
  ): Promise<ForgeAttemptResponse[]> {
    const defaultOrder: Order = [['slot', order]];

    const query = {
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

    const foundForgeAttempts = await this.forgeAttemptModel.findAll(query);

    return foundForgeAttempts.map((f) => new ForgeAttemptResponse(f));
  }

  public async processTransaction(transactionHistory: TransactionHistory) {
    if (!transactionHistory.containsClaimInstruction) {
      return;
    }

    const claimInstruction = transactionHistory.data.instructions.find(
      (ix) => ix.data === ELEMENTERRA_PROGRAM_CLAIM_PENDING_GUESS_DATA,
    );

    if (_.isNil(claimInstruction)) {
      console.error(
        `Consistency Error! Transaction ${transactionHistory.tx} is marked as containsClaimInstruction but there was no instruction with data "${ELEMENTERRA_PROGRAM_CLAIM_PENDING_GUESS_DATA}"`,
      );
      return;
    }

    const guessAddress = claimInstruction.accounts[12];

    let guess = await this.recipesService.getGuess(guessAddress);

    if (_.isNil(guess)) {
      guess = await this.recipesService.pollGuess(guessAddress, 0);
    }

    if (_.isNil(guess)) {
      console.error(
        `Could not find guess account for claim transaction ${transactionHistory.tx}`,
      );
      return;
    }

    return this.processTransactionAndGuess(
      transactionHistory,
      guessAddress,
      guess,
    );
  }

  public async processTransactionAndGuess(
    transaction: TransactionHistory,
    guessAddress: string,
    guess: GuessModel,
  ) {
    await this.recipesService.upsertGuess(guess);

    await this.forgeAttemptModel.upsert({
      tx: transaction.tx,
      timestamp: transaction.timestamp,
      slot: transaction.slot,
      guesser: transaction.feePayer,
      hasFailed: !guess.isSuccess,
      guessAddress,
      guess: guess.recipe,
    });

    const thresholdTimestamp = new Date().getTime() / 1000 - 60;

    if (transaction.timestamp > thresholdTimestamp) {
      this.eventsService.sendForgeEvent(
        transaction.timestamp,
        transaction.feePayer,
        guess,
      );
    }
  }
}
