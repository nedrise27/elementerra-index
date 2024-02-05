import { ApiPropertyOptional } from '@nestjs/swagger';

export class ReplayElementsRequest {
  @ApiPropertyOptional()
  before?: string;

  @ApiPropertyOptional()
  limit?: number;
}
