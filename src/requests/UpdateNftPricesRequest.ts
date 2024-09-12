import { ApiProperty } from '@nestjs/swagger';

export class UpdateNftPriceRequest {
  @ApiProperty({
    type: String,
    enum: ['elementerra_rabbits', 'elementerra_crystals', 'elementerra_chests'],
  })
  collection: string;

  @ApiProperty()
  level: number;

  @ApiProperty()
  priceInSol: number;
}

export class UpdateNftPricesRequest {
  @ApiProperty({
    type: [UpdateNftPriceRequest],
  })
  nftPrices: UpdateNftPriceRequest[];
}
