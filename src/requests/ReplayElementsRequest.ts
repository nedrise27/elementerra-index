import { ApiPropertyOptional } from '@nestjs/swagger';

export class ReplayElementsRequest {
  @ApiPropertyOptional()
  limit?: number;

  @ApiPropertyOptional()
  page?: number;
}
