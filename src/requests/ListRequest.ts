import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListRequest {
  @ApiPropertyOptional()
  page?: number;

  @ApiPropertyOptional()
  size?: number;
}
