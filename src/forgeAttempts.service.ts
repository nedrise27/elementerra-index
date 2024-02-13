import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { Guess } from 'clients/elementerra-program/accounts';
import * as _ from 'lodash';
import { Op, Order } from 'sequelize';
import { HeliusService } from './helius.service';
import { ELEMENTERRA_PROGRAM_CLAIM_PENDING_GUESS_DATA } from './lib/constants';
import { cleanAndOrderRecipe } from './lib/elements';
import { sendWebsocketEvent } from './lib/events';
import { ForgeAttempt, TransactionHistory } from './models';
import { RecipesService } from './recipes.service';
import { ForgeAttemptResponse } from './responses/ForgeAttemptResponse';
import { asyncSleep } from './lib/util';

@Injectable()
export class ForgeAttemptsService {
  constructor(
    @InjectModel(ForgeAttempt)
    private readonly forgeAttemptModel: typeof ForgeAttempt,
    private readonly heliusService: HeliusService,
    private readonly recipesService: RecipesService,
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

    let guess = await Guess.fetch(
      this.heliusService.connection,
      new PublicKey(guessAddress),
    );

    if (_.isNil(guess)) {
      await asyncSleep(1000);

      guess = await Guess.fetch(
        this.heliusService.connection,
        new PublicKey(guessAddress),
      );
      if (_.isNil(guess)) {
        console.error(
          `Could not find guess account for claim transaction ${transactionHistory.tx}`,
        );
        return;
      }
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
    guess: Guess,
  ) {
    const recipe = cleanAndOrderRecipe([
      guess.elementTried1Name,
      guess.elementTried2Name,
      guess.elementTried3Name,
      guess.elementTried4Name,
    ]);

    const [[, created]] = await Promise.all([
      this.forgeAttemptModel.upsert({
        tx: transaction.tx,
        timestamp: transaction.timestamp,
        slot: transaction.slot,
        guesser: transaction.feePayer,
        hasFailed: !guess.isSuccess,
        guessAddress,
        guess: recipe,
      }),
      this.recipesService.checkAndUpdateRecipes(guess, guessAddress),
    ]);

    let msg: string | undefined;

    if (guess.numberOfTimesTried.toNumber() === 1) {
      msg = `Tried a new recipe ['${recipe.join("', '")}'] and ${guess.isSuccess ? 'SUCCEEDED! ^.^' : 'FAILED -.-'}`;

      console.log(`${transaction.feePayer} ${msg}`);
    } else {
      msg = `Forged ['${recipe.join("', '")}']`;
    }

    if (created) {
      try {
        await sendWebsocketEvent(
          transaction.timestamp,
          transaction.feePayer,
          msg,
        );
      } catch (err) {
        console.error(`Error while sending websocket event. Error: '${err}'`);
      }
    }
  }
}
