import { ApiProperty } from '@nestjs/swagger';

export class StatsResponse {
  @ApiProperty()
  forgeAttemptCount: number;

  @ApiProperty()
  successfulForgeAttemptsCount: number;

  @ApiProperty()
  unsuccessfulForgeAttemptsCount: number;
}
