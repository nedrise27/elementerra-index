import { ApiProperty } from '@nestjs/swagger';
import { GuessModel } from 'src/models/Guess.model';

export class GetGuessResponse {
  @ApiProperty()
  address: string;

  constructor(guess: GuessModel) {
    this.address = guess.address;
  }
}
