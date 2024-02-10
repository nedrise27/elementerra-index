import { ApiProperty } from '@nestjs/swagger';

export class GetAvailableRecipesResponse {
  @ApiProperty()
  numberOfPossibilies: number;

  @ApiProperty()
  possibilities: string[][];

  @ApiProperty()
  alreadyTried: string[][];

  constructor(possibilities: string[][], alreadyTried: string[][]) {
    this.numberOfPossibilies = possibilities.length;
    this.possibilities = possibilities;
    this.alreadyTried = alreadyTried;
  }
}
