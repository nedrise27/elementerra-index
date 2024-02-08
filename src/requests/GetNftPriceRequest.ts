import { ApiProperty } from '@nestjs/swagger';

export class GetNftPriceRequest {
  @ApiProperty({
    type: String,
    enum: ['elementerra_rabbits', 'elementerra_crystals', 'elementerra_chests'],
  })
  collection: string;

  @ApiProperty()
  level: number;
}
