import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as _ from 'lodash';
import { ELEMENTS, cleanAndOrderRecipe } from './lib/elements';
import { Element, ForgeAttempt } from './models';
import { Recipe } from './models/Recipe';
import { CheckRecipeResponse } from './responses/CheckRecipeResponse';
import { GetAvailableRecipesResponse } from './responses/GetAvailableRecipesResponse';
import { Op } from 'sequelize';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(ForgeAttempt)
    private readonly forgeAttemptModel: typeof ForgeAttempt,
    @InjectModel(Element)
    private readonly elementModel: typeof Element,
    @InjectModel(Recipe)
    private readonly recipeModel: typeof Recipe,
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
    elements: string[],
    tier: number,
  ): Promise<GetAvailableRecipesResponse> {
    let availableElements = ELEMENTS.filter((e) => elements.includes(e.name));

    const requiredTier = tier - 1;

    // If no element with one less tier than searched is given in suggestion add all elements from lower tier
    if (_.isNil(availableElements.find((e) => e.tier === requiredTier))) {
      availableElements = availableElements.concat(
        ELEMENTS.filter((e) => e.tier === requiredTier),
      );
    }

    const requiredElements = availableElements.filter(
      (e) => e.tier === requiredTier,
    );

    const possibilities = [];

    for (const first of requiredElements.map((e) => e.name)) {
      for (const second of availableElements.map((e) => e.name)) {
        for (const third of availableElements.map((e) => e.name)) {
          for (const fourth of availableElements.map((e) => e.name)) {
            const possibility = [first, second, third, fourth];
            possibility.sort();
            if (!possibilities.find((p) => _.isEqual(p, possibility))) {
              possibilities.push([first, second, third, fourth]);
            }
          }
        }
      }
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

    if (_.isNil(foundRecipe)) {
      await this.recipeModel.create({
        elements,
        wasSuccessful: !forgeAttempt.hasFailed,
      });

      console.log(`NEW RECIPE TRIED: ['${elements.join("', '")}']`);
    }
  }
}
