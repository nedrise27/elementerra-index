import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GuessModel } from './models/Guess.model';
import { GetGuessResponse } from './responses/GetGuessResponse';
import { cleanAndOrderRecipe } from './lib/elements';

@Injectable()
export class GuessesService {
  constructor(
    @InjectModel(GuessModel)
    private readonly guessModel: typeof GuessModel,
  ) {}

  public async getGuess(recipe: string[]): Promise<GetGuessResponse> {
    const guess = await this.guessModel.findOne({
      where: {
        recipe: cleanAndOrderRecipe(recipe),
      },
    });

    return new GetGuessResponse(guess);
  }
}
