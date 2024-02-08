import { ApiProperty } from '@nestjs/swagger';

export class ReplayElementsResponse {
  @ApiProperty()
  firstId: string;

  @ApiProperty()
  lastId: string;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  total: number;
}
