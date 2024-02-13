import { ApiProperty } from '@nestjs/swagger';
import { ForgeAttempt } from 'src/models';

export class ForgeAttemptResponse {
  @ApiProperty()
  tx: string;

  @ApiProperty()
  timestamp: number;

  @ApiProperty()
  slot: number;

  @ApiProperty()
  guesser: string;

  @ApiProperty()
  hasFailed: boolean;

  @ApiProperty()
  guess: string[];

  constructor(forgeAttempt: ForgeAttempt) {
    this.tx = forgeAttempt.tx;
    this.timestamp = forgeAttempt.timestamp;
    this.slot = forgeAttempt.slot;
    this.guesser = forgeAttempt.guesser;
    this.hasFailed = forgeAttempt.hasFailed;
    this.guess = forgeAttempt.guess;
  }
}
