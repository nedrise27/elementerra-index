import { ApiPropertyOptional } from '@nestjs/swagger';

export class ReplayForgeAttemptsRequest {
  @ApiPropertyOptional()
  guesser?: string;

  @ApiPropertyOptional()
  before?: string;

  @ApiPropertyOptional()
  type?: string;
}
