import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NftPricesService } from './nftPrices.service';
import { GetNftPriceRequest } from './requests/GetNftPriceRequest';
import { NftPriceResponse } from './responses/NftPriceResponse';
import * as _ from 'lodash';

@ApiTags('NFT Prices')
@Controller('nft-prices')
export class NftPricesController {
  constructor(private readonly nftPricesService: NftPricesService) {}

  @Get('/:collection/:level')
  public async getNftPrice(
    @Query() query?: GetNftPriceRequest,
  ): Promise<NftPriceResponse> {
    if (_.isNil(query?.collection) || _.isNil(query?.level)) {
      throw new BadRequestException(
        `Please provide path parameters /:colleciton/:level`,
      );
    }

    return this.nftPricesService.getNftPrice(query);
  }
}
