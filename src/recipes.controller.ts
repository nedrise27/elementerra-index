import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as _ from 'lodash';
import { cleanAndOrderRecipe, ElementName } from './lib/elements';
import { RecipesService } from './recipes.service';
import { CheckRecipeRequest } from './requests/CheckRecipeRequest';
import { GetAvailableRecipesRequest } from './requests/GetAvailableRecipesRequest';
import { CheckRecipeResponse } from './responses/CheckRecipeResponse';
import { GetAvailableRecipesResponse } from './responses/GetAvailableRecipesResponse';

@ApiTags('Recipes')
@Controller('recipes')
export class RecipesController {
  MAX_ELEMENT_COMBINATION = 50;

  constructor(private readonly recipesService: RecipesService) {}

  @Post('check-recipe')
  public async checkRecipe(
    @Body() request: CheckRecipeRequest,
  ): Promise<CheckRecipeResponse> {
    if (request.elements.length !== 4) {
      throw new BadRequestException('Please provide exacly 4 elements');
    }

    this.checkElementNames(request.elements);

    const receipe = cleanAndOrderRecipe(request.elements);
    return this.recipesService.checkRecipe(receipe);
  }

  @Post('get-available-recipes')
  public async getAvailableRecipes(
    @Body() request: GetAvailableRecipesRequest,
  ): Promise<GetAvailableRecipesResponse> {
    this.checkElementNames(request.elements?.map((e) => e.element));

    if (request.elements.length > this.MAX_ELEMENT_COMBINATION) {
      throw new BadRequestException(
        `Pleas provide at most ${this.MAX_ELEMENT_COMBINATION}`,
      );
    }

    return this.recipesService.getAvailableRecipes(
      request.elements,
      request.tier,
    );
  }

  private checkElementNames(elements: string[]) {
    for (const e of elements) {
      if (_.isNil(ElementName[e])) {
        throw new BadRequestException(
          `Element name '${e}' is not valid please provide one of ['${Object.keys(ElementName).join("', '")}']`,
        );
      }
    }
  }
}
