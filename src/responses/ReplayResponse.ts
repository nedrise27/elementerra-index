import { ApiProperty } from '@nestjs/swagger';

export class ReplayResponse {
  @ApiProperty()
  firstTransaction: string;

  @ApiProperty()
  firstSlot: number;

  @ApiProperty()
  lastTransaction: string;

  @ApiProperty()
  lastSlot: number;
}
