import { ApiPropertyOptional } from '@nestjs/swagger';

export class ReplayRecipesRequest {
  @ApiPropertyOptional()
  season?: number;
}
