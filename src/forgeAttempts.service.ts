import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PublicKey } from '@solana/web3.js';
import { Guess } from 'clients/elementerra-program/accounts';
import * as _ from 'lodash';
import { Op, Order } from 'sequelize';
import { HeliusService } from './helius.service';
import { ELEMENTERRA_PROGRAM_CLAIM_PENDING_GUESS_DATA } from './lib/constants';
import { ELEMENTS_IDS } from './lib/elements';
import { EventTopics, ForgeEvent } from './lib/events';
import { asyncSleep } from './lib/util';
import { ForgeAttempt, TransactionHistory } from './models';
import { GuessModel } from './models/Guess.model';
import { RecipesService } from './recipes.service';
import { ForgeAttemptResponse } from './responses/ForgeAttemptResponse';
import { EventsService } from './events.service';

@Injectable()
export class ForgeAttemptsService {
  constructor(
    @InjectModel(ForgeAttempt)
    private readonly forgeAttemptModel: typeof ForgeAttempt,
    private readonly heliusService: HeliusService,
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

  public async pollGuess(
    guessAddress: string,
    depth: number,
  ): Promise<GuessModel | undefined> {
    let guess: Guess | undefined;

    await asyncSleep(_.random(100, 1000, false));

    try {
      guess = await Guess.fetch(
        this.heliusService.connection,
        new PublicKey(guessAddress),
      );
    } catch (err) {
      console.error(`Error fetching guess ${guessAddress}`);
    }

    if (!_.isNil(guess)) {
      return GuessModel.fromGuess(guessAddress, guess);
    }

    if (depth >= 10) {
      return;
    }

    await asyncSleep(2000);
    console.log(`Trying to fetch guess ${guessAddress} ${depth} times`);
    return this.pollGuess(guessAddress, depth + 1);
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

    const guess = await this.pollGuess(guessAddress, 0);

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

    let eventTopic = EventTopics.forging;
    let user = transaction.feePayer;

    if (guess.numberOfTimesTried === 1) {
      if (guess.isSuccess) {
        eventTopic = EventTopics.inventing;
        user = guess.creator;
      } else {
        eventTopic = EventTopics.inventionAttempt;
      }
    }

    const thresholdTimestamp = new Date().getTime() / 1000 - 60;

    if (transaction.timestamp > thresholdTimestamp) {
      try {
        await this.eventsService.sendForgeEvent(
          eventTopic,
          transaction.timestamp,
          user,
          guess,
        );
      } catch (err) {
        console.error(`Error while sending websocket event. Error: '${err}'`);
      }
    }
  }
}
