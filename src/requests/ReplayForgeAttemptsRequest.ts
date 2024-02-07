import { ApiPropertyOptional } from '@nestjs/swagger';

export class ReplayTransactionHistoryRequest {
  @ApiPropertyOptional()
  guesser?: string;

  @ApiPropertyOptional()
  before?: string;

  @ApiPropertyOptional()
  type?: string;
}

export class ReplayForgeAttemptsRequest {
  @ApiPropertyOptional()
  limit?: number;

  @ApiPropertyOptional()
  guesser?: string;

  @ApiPropertyOptional()
  beforeSlot?: number;
}
