import { ApiPropertyOptional } from '@nestjs/swagger';
import { ListRequest } from './ListRequest';
import { ORDER_DIRECTIONS } from 'src/lib/pagination';

export class ListForgeAttemptsRequest extends ListRequest {
  @ApiPropertyOptional()
  guesser?: string;

  @ApiPropertyOptional({ enum: ORDER_DIRECTIONS })
  order?: string;

  @ApiPropertyOptional()
  beforeTimestamp?: number;
}
