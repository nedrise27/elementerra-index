import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as _ from 'lodash';
import { NftPricesService } from './nftPrices.service';
import { GetNftPriceRequest } from './requests/GetNftPriceRequest';
import { NftPriceResponse } from './responses/NftPriceResponse';
import { UpdateNftPricesRequest } from './requests/UpdateNftPricesRequest';

@ApiTags('NFT Prices')
@Controller('nft-prices')
export class NftPricesController {
  constructor(private readonly nftPricesService: NftPricesService) {}

  @Get('/:collection/:level')
  public async getNftPrice(
    @Param() query?: GetNftPriceRequest,
  ): Promise<NftPriceResponse> {
    if (_.isNil(query?.collection) || _.isNil(query?.level)) {
      throw new BadRequestException(
        `Please provide path parameters /:colleciton/:level`,
      );
    }

    return this.nftPricesService.getNftPrice(query);
  }

  @Patch('')
  public async updateNftPrices(
    @Body() request?: UpdateNftPricesRequest,
  ): Promise<void> {
    return this.nftPricesService.updateNftPrice(request);
  }
}
