import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as _ from 'lodash';

import { GuessesService } from './guesses.service';
import { ElementName } from './lib/elements';
import { GetGuessRequest } from './requests/GetGuessRequest';
import { GetGuessResponse } from './responses/GetGuessResponse';

@ApiTags('Guesses')
@Controller('guesses')
export class GuessesController {
  constructor(private readonly guessesService: GuessesService) {}

  @Post('/get')
  public async getGuess(
    @Body() request: GetGuessRequest,
  ): Promise<GetGuessResponse> {
    if (request?.recipe?.length !== 4) {
      throw new BadRequestException('Please provide exacly 4 elements');
    }

    this.checkElementNames(request.recipe);

    return this.guessesService.getGuess(request.recipe);
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
