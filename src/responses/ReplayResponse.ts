import { ApiProperty } from '@nestjs/swagger';

export class ReplayResponse {
  @ApiProperty()
  lastTransaction: string;

  @ApiProperty()
  lastSlot: number;
}
