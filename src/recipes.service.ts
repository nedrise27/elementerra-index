import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BN } from 'bn.js';
import { Guess } from 'clients/elementerra-program/accounts';
import * as _ from 'lodash';
import { Op } from 'sequelize';
import { ELEMENTS, ElementName, cleanAndOrderRecipe } from './lib/elements';
import { sendWebsocketEvent } from './lib/events';
import { Element } from './models';
import { GuessModel } from './models/Guess.model';
import { GetAvailableRecipesRequestElement } from './requests/GetAvailableRecipesRequest';
import { CheckRecipeResponse } from './responses/CheckRecipeResponse';
import { GetAvailableRecipesResponse } from './responses/GetAvailableRecipesResponse';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Element)
    private readonly elementModel: typeof Element,
    @InjectModel(GuessModel)
    private readonly guessModel: typeof GuessModel,
  ) {}

  public async checkRecipe(recipe: string[]): Promise<CheckRecipeResponse> {
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
      .map((r) => ELEMENTS.find((e) => e.name === r.element))
      .filter((e) => e.tier === requiredTier);

    if (_.isNil(requiredTierElements) || _.isEmpty(requiredTierElements)) {
      throw new BadRequestException(
        `For a tier ${tier} element we need at least one tier ${requiredTier} element.`,
      );
    }

    let possibilities: ElementName[][] = [];

    for (const first of requiredTierElements) {
      for (const second of requestedElements) {
        for (const third of requestedElements) {
          for (const fourth of requestedElements) {
            const possibility = [
              first.name,
              second.element,
              third.element,
              fourth.element,
            ];
            possibility.sort();

            if (!possibilities.find((p) => _.isEqual(p, possibility))) {
              possibilities.push(possibility);
            }
          }
        }
      }
    }

    for (const requirement of requestedElements) {
      possibilities = possibilities.filter((possibility) => {
        const count = possibility.filter(
          (p) => p === requirement.element,
        ).length;

        return _.inRange(
          count,
          requirement.minAmount,
          requirement.maxAmount + 1,
        );
      });
    }

    const foundRecipes = await this.guessModel.findAll({
      where: {
        recipe: { [Op.in]: possibilities },
      },
    });

    const foundPossibilies = foundRecipes.map((r) => {
      const elements = r.recipe;
      elements.sort();
      return elements;
    });

    const res = possibilities.filter((p) =>
      _.isNil(foundPossibilies.find((f) => _.isEqual(f, p))),
    );

    return new GetAvailableRecipesResponse(res, foundPossibilies);
  }

  public async replay() {
    const successfulRecipes = await this.elementModel.sequelize.query(
      `select distinct on (recipe) fa.tx,array_agg(e.name order by e.name asc) recipe, fa.has_failed as "hasFailed" from elements e join forge_attempts fa on (fa.tx = e.forge_attempt_tx) where fa.has_failed = 'f' group by fa.tx`,
    );
    const failedRecipes = await this.elementModel.sequelize.query(
      `select distinct on (recipe) fa.tx,array_agg(e.name order by e.name asc) recipe, fa.has_failed as "hasFailed" from elements e join forge_attempts fa on (fa.tx = e.forge_attempt_tx) where fa.has_failed = 't' group by fa.tx`,
    );

    const successfulElements = [];
    for (const r of successfulRecipes[0]) {
      const row: any = r;
      const recipe = row.recipe.map((e) => e.replace(' ', '').toLowerCase());
      recipe.sort();
      const isSuccess: boolean = !row.hasFailed;

      successfulElements.push(recipe);

      const res = await this.guessModel.findOne({
        where: {
          recipe,
        },
      });
      if (_.isNil(res)) {
        await this.guessModel.create({
          recipe,
          isSuccess,
        });
      }
    }

    for (const r of failedRecipes[0]) {
      const row: any = r;
      const recipe = row.recipe.map((e) => e.replace(' ', '').toLowerCase());
      recipe.sort();
      const wasSuccessful: boolean = !row.hasFailed;

      if (!successfulElements.find((e) => _.isEqual(e, recipe))) {
        const res = await this.guessModel.findOne({ where: { recipe } });

        if (_.isNil(res)) {
          await this.guessModel.create({
            recipe,
            wasSuccessful,
          });
        }
      }
    }
  }

  public async checkAndUpdateRecipes(
    guesser: string,
    timestamp: number,
    guess: Guess,
    guessAddress: string,
  ) {
    const guessedRecipe = [
      guess.elementTried1Name,
      guess.elementTried2Name,
      guess.elementTried3Name,
      guess.elementTried4Name,
    ];

    const recipe = cleanAndOrderRecipe(guessedRecipe);

    const foundRecipe = await this.guessModel.findOne({ where: { recipe } });

    let msg: string | undefined;
    let created: null | boolean;

    if (_.isNil(foundRecipe)) {
      const res = await this.guessModel.upsert({
        address: guessAddress,
        seasonNumber: guess.seasonNumber,
        numberOfTimesTried: guess.numberOfTimesTried.toNumber(),
        isSuccess: guess.isSuccess,
        element: guess.element.toString(),
        recipe,
        creator: guess.creator.toString(),
      });
      created = res[1];
    }

    if (guess.numberOfTimesTried === new BN(1)) {
      msg = `Tried a new recipe ['${recipe.join("', '")}'] and ${guess.isSuccess ? 'SUCCEEDED! ^.^' : 'FAILED -.-'}`;

      console.log(`${guesser} ${msg}`);
    } else {
      msg = `Forged ['${recipe.join("', '")}']`;
    }

    try {
      if (created) {
        await sendWebsocketEvent(timestamp, guesser, msg);
      }
    } catch (err) {
      console.error(`Error while sending websocket event. Error: '${err}'`);
    }
  }
}
