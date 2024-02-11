import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as _ from 'lodash';
import { Op } from 'sequelize';
import { EventsGateway } from './events.gateway';
import { ELEMENTS, ElementName, cleanAndOrderRecipe } from './lib/elements';
import { Element, ForgeAttempt } from './models';
import { Recipe } from './models/Recipe';
import { GetAvailableRecipesRequestElement } from './requests/GetAvailableRecipesRequest';
import { CheckRecipeResponse } from './responses/CheckRecipeResponse';
import { GetAvailableRecipesResponse } from './responses/GetAvailableRecipesResponse';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Element)
    private readonly elementModel: typeof Element,
    @InjectModel(Recipe)
    private readonly recipeModel: typeof Recipe,
    private readonly eventsGateway: EventsGateway,
  ) {}

  public async checkRecipe(elements: string[]): Promise<CheckRecipeResponse> {
    const foundRecipe = await this.recipeModel.findOne({ where: { elements } });

    let wasTried: boolean = false;
    let wasSuccessful: boolean | null = null;

    if (!_.isNil(foundRecipe)) {
      wasTried = true;
      wasSuccessful = foundRecipe.wasSuccessful;
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

    const foundRecipes = await this.recipeModel.findAll({
      where: {
        elements: { [Op.in]: possibilities },
      },
    });

    const foundPossibilies = foundRecipes.map((r) => {
      const elements = r.elements;
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
      const elements = row.recipe.map((e) => e.replace(' ', '').toLowerCase());
      elements.sort();
      const wasSuccessful: boolean = !row.hasFailed;

      successfulElements.push(elements);

      const res = await this.recipeModel.findOne({
        where: {
          elements,
        },
      });
      if (_.isNil(res)) {
        await this.recipeModel.create({
          elements,
          wasSuccessful,
        });
      }
    }

    for (const r of failedRecipes[0]) {
      const row: any = r;
      const elements = row.recipe.map((e) => e.replace(' ', '').toLowerCase());
      elements.sort();
      const wasSuccessful: boolean = !row.hasFailed;

      if (!successfulElements.find((e) => _.isEqual(e, elements))) {
        const res = await this.recipeModel.findOne({ where: { elements } });

        if (_.isNil(res)) {
          await this.recipeModel.create({
            elements,
            wasSuccessful,
          });
        }
      }
    }
  }

  public async checkAndUpdateRecipes(forgeAttempt: ForgeAttempt) {
    const guessedElements = await this.elementModel.findAll({
      where: { forgeAttemptTx: forgeAttempt.tx },
    });

    if (guessedElements.length !== 4) {
      console.log(
        `Could not find four guessedElements for ClaimTx ${forgeAttempt.tx}`,
      );
      return;
    }

    const elements = cleanAndOrderRecipe(guessedElements);

    const foundRecipe = await this.recipeModel.findOne({ where: { elements } });

    let msg: string | undefined;

    if (_.isNil(foundRecipe)) {
      await this.recipeModel.create({
        elements,
        wasSuccessful: !forgeAttempt.hasFailed,
      });

      msg = `Tried a new recipe ['${elements.join("', '")}'] and ${forgeAttempt.hasFailed ? 'FAILED -.-' : 'SUCCEEDED! ^.^'}`;

      console.log(`${forgeAttempt.guesser} ${msg}`);
    } else {
      msg = `Forged ['${elements.join("', '")}']`;
    }

    this.eventsGateway.sendEvent(
      forgeAttempt.timestamp,
      forgeAttempt.guesser,
      msg,
    );
  }
}
