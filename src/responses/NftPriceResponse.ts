import { ApiProperty } from '@nestjs/swagger';
import { NftPrice } from 'src/models/NftPrice.model';

export class NftPriceResponse {
  @ApiProperty()
  mint: string;

  @ApiProperty()
  collection: string;

  @ApiProperty()
  level: number;

  @ApiProperty()
  priceInSol: number;

  @ApiProperty()
  timestamp: number;

  constructor(nftPrice: NftPrice) {
    this.mint = nftPrice.mint;
    this.collection = nftPrice.collection;
    this.level = nftPrice.level;
    this.priceInSol = nftPrice.priceInSol;
    this.timestamp = nftPrice.timestamp;
  }
}
