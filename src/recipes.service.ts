import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Guess } from 'clients/elementerra-program/accounts';
import * as _ from 'lodash';
import { Op } from 'sequelize';
import { ELEMENTS, ElementName, cleanAndOrderRecipe } from './lib/elements';
import { Element } from './models';
import { GuessModel } from './models/Guess.model';
import { GetAvailableRecipesRequestElement } from './requests/GetAvailableRecipesRequest';
import { CheckRecipeResponse } from './responses/CheckRecipeResponse';
import { GetAvailableRecipesResponse } from './responses/GetAvailableRecipesResponse';
import { RecipeRequestLog } from './models/RecipeRequestLog';
import { HeliusService } from './helius.service';
import { PROGRAM_ID } from 'clients/elementerra-program/programId';
import { GetProgramAccountsFilter, PublicKey } from '@solana/web3.js';
import { asyncSleep } from './lib/util';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Element)
    private readonly elementModel: typeof Element,
    @InjectModel(GuessModel)
    private readonly guessModel: typeof GuessModel,
    @InjectModel(RecipeRequestLog)
    private readonly recipeRequestLogModel: typeof RecipeRequestLog,
    private readonly heliusService: HeliusService,
  ) {}

  public async getGuess(address: string): Promise<GuessModel | undefined> {
    const foundGuess = await this.guessModel.findOne({ where: { address } });
    if (!_.isNil(foundGuess)) {
      return foundGuess;
    }
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
      const g = GuessModel.fromGuess(guessAddress, guess);
      if (depth > 0) {
        console.log(
          `Polled guess with recipe ${g.recipe} after ${depth} tries.`,
        );
      }
      return g;
    }

    if (depth >= 10) {
      console.error(
        `Could not fetch guess ${guessAddress} after ${depth} tries.`,
      );
      return;
    }

    await asyncSleep(2000);

    return this.pollGuess(guessAddress, depth + 1);
  }

  public async upsertGuess(guess: GuessModel) {
    return this.guessModel.upsert({
      address: guess.address,
      seasonNumber: guess.seasonNumber,
      numberOfTimesTried: guess.numberOfTimesTried,
      isSuccess: guess.isSuccess,
      element: guess.element,
      recipe: guess.recipe,
      creator: guess.creator,
    });
  }

  public async checkRecipe(recipe: string[]): Promise<CheckRecipeResponse> {
    await this.recipeRequestLogModel.create({
      elements: recipe,
      timestamp: _.toInteger(new Date().getTime() / 1000),
    });

    const foundRecipe = await this.guessModel.findOne({ where: { recipe } });

    let wasTried: boolean = false;
    let wasSuccessful: boolean | null = null;

    if (!_.isNil(foundRecipe)) {
      wasTried = true;
      wasSuccessful = foundRecipe.isSuccess;
    }

    return new CheckRecipeResponse(wasTried, wasSuccessful);
  }

  public async getAvailableRecipes(
    requestedElements: GetAvailableRecipesRequestElement[],
    tier: number,
  ): Promise<GetAvailableRecipesResponse> {
    const requiredTier = tier - 1;

    const requiredTierElements = requestedElements
      .map((r) => ({
        ...r,
        tier: ELEMENTS.find((e) => e.name === r.element).tier,
      }))
      .filter((e) => e.tier === requiredTier);

    const requiredElements = requestedElements
      .filter((request) => request.minAmount > 0)
      .map((request) => request.element);

    if (_.isNil(requiredTierElements) || _.isEmpty(requiredTierElements)) {
      throw new BadRequestException(
        `For a tier ${tier} element we need at least one tier ${requiredTier} element.`,
      );
    }

    await this.recipeRequestLogModel.create({
      elements: requestedElements.map((e) => e.element),
      timestamp: _.toInteger(new Date().getTime() / 1000),
    });

    // let possibilities: ElementName[][] = [];
    const possibilities: Record<string, Record<ElementName, number>> = {};

    for (const first of requiredTierElements) {
      for (const second of requestedElements) {
        for (const third of requestedElements) {
          for (const fourth of requestedElements) {
            const p = [
              first.element,
              second.element,
              third.element,
              fourth.element,
            ];

            let containsAllRequired = true;

            for (const requiredElement of requiredElements) {
              if (!p.includes(requiredElement)) {
                containsAllRequired = false;
                break;
              }
            }

            if (!containsAllRequired) continue;

            const possibility = this.countPossibility(p);

            if (
              _.inRange(
                possibility[first.element],
                first.minAmount,
                first.maxAmount + 1,
              ) &&
              _.inRange(
                possibility[second.element],
                second.minAmount,
                second.maxAmount + 1,
              ) &&
              _.inRange(
                possibility[third.element],
                third.minAmount,
                third.maxAmount + 1,
              ) &&
              _.inRange(
                possibility[fourth.element],
                fourth.minAmount,
                fourth.maxAmount + 1,
              )
            ) {
              const hash = this.hashPossibility(possibility);
              possibilities[hash] = possibility;
            }
          }
        }
      }
    }

    const possibilitiesList = Object.values(possibilities).map(
      this.unpackCountedPossibilities,
    );

    const foundRecipes = await this.guessModel.findAll({
      where: {
        recipe: {
          [Op.in]: possibilitiesList,
        },
      },
    });

    for (const recipe of foundRecipes) {
      const hash = this.hashPossibility(this.countPossibility(recipe.recipe));
      delete possibilities[hash];
    }

    const foundPossibilies = foundRecipes.map((r) => {
      const elements = r.recipe;
      elements.sort();
      return elements;
    });

    const res = Object.values(possibilities).map(
      this.unpackCountedPossibilities,
    );

    return new GetAvailableRecipesResponse(res, foundPossibilies);
  }

  private hashPossibility(possibility: Record<string, number>): string {
    const entries = Object.entries(possibility).map(
      ([element, count]) => `${element}${count}`,
    );
    entries.sort();
    return entries.join('');
  }

  private countPossibility(recipe: string[]): Record<string, number> {
    const possibility: Record<string, number> = {};

    for (const element of recipe) {
      if (!_.has(possibility, element)) {
        possibility[element] = 1;
      } else {
        possibility[element] += 1;
      }
    }

    return possibility;
  }

  private unpackCountedPossibilities(
    possibility: Record<string, number>,
  ): string[] {
    const unpacked = [];
    for (const [element, count] of Object.entries(possibility)) {
      for (let i = 0; i < count; i++) {
        unpacked.push(element);
      }
    }
    unpacked.sort();
    return unpacked;
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  private async replayCurrentSeason() {
    await this.replay(2);
  }

  public async replay(season?: number) {
    const filters: GetProgramAccountsFilter[] = [
      {
        memcmp: {
          offset: 0,
          bytes: Guess.discriminator.toString('base64'),
          encoding: 'base64',
        },
      },
    ];

    if (!_.isNil(season)) {
      filters.push({
        memcmp: {
          offset: 9,
          bytes: Buffer.from([season]).toString('base64'),
          encoding: 'base64',
        },
      });
    }

    const guesses = await this.heliusService.connection.getProgramAccounts(
      PROGRAM_ID,
      { filters },
    );

    console.log(
      `Replaying ${guesses.length} Guesses from ${_.isNil(season) ? 'all seasons' : 'season ' + season}`,
    );

    for (const item of guesses) {
      const address = item.pubkey.toString();
      const guessIDL = Guess.decode(item.account.data);
      const recipe = cleanAndOrderRecipe([
        guessIDL.elementTried1Name,
        guessIDL.elementTried2Name,
        guessIDL.elementTried3Name,
        guessIDL.elementTried4Name,
      ]);

      const res = await this.guessModel.findOne({
        where: {
          recipe,
        },
      });

      if (_.isNil(res)) {
        console.log(`Saving guess ${address} with recipe ${recipe}`);
        await this.guessModel.create({
          address,
          seasonNumber: guessIDL.seasonNumber,
          numberOfTimesTried: guessIDL.numberOfTimesTried.toNumber(),
          isSuccess: guessIDL.isSuccess,
          element: guessIDL.element.toString(),
          recipe,
          creator: guessIDL.creator.toString(),
        });
      }
    }
  }
}
