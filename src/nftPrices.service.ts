import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import * as _ from 'lodash';
import { lastValueFrom } from 'rxjs';
import { NftPrice } from './models/NftPrice.model';
import { GetNftPriceRequest } from './requests/GetNftPriceRequest';
import { NftPriceResponse } from './responses/NftPriceResponse';

@Injectable()
export class NftPricesService {
  constructor(
    @InjectModel(NftPrice)
    private readonly nftPriceModel: typeof NftPrice,
    private readonly httpService: HttpService,
  ) {}

  MAGIC_EDEN_BASE_URL = 'https://api-mainnet.magiceden.dev/v2';
  MAGIC_EDEN_RATE_LIMIT = 4000;
  MAGIC_EDEN_BEARER_TOKEN = process.env.MAGIC_EDEN_API_KEY;
  CRYSTAL_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  CHEST_TIERS = [1, 2, 3, 4, 5, 6, 7];

  public async getNftPrice(
    query: GetNftPriceRequest,
  ): Promise<NftPriceResponse> {
    const nftPrice = await this.nftPriceModel.findOne({
      where: {
        collection: query.collection,
        level: query.level,
      },
      order: [['timestamp', 'desc']],
      limit: 1,
    });

    if (!_.isNil(nftPrice)) {
      return new NftPriceResponse(nftPrice);
    }

    throw new NotFoundException(
      `Could not find price for collection ${query?.collection} and level ${query?.level}`,
    );
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  @Cron('0 */4 * * * *')
  async fetchRabbitPrice() {
    if (process.env.NO_CRON) {
      return;
    }

    await this.fetchAndSaveRabbitPrice();

    await this.sleep(this.MAGIC_EDEN_RATE_LIMIT);

    for (const crystalLevel of this.CRYSTAL_LEVELS) {
      await this.fetchAndSaveCrystalPrice(crystalLevel);
      await this.sleep(this.MAGIC_EDEN_RATE_LIMIT);
    }

    for (const chestLevel of this.CHEST_TIERS) {
      await this.fetchAndSaveChestPrice(chestLevel);
      await this.sleep(this.MAGIC_EDEN_RATE_LIMIT);
    }
  }

  private get bearerTokenHeader() {
    return {
      Authorization: `Bearer ${this.MAGIC_EDEN_BEARER_TOKEN}`,
    };
  }

  private async fetchAndSaveRabbitPrice() {
    const res = await lastValueFrom(
      this.httpService.get(
        `${this.MAGIC_EDEN_BASE_URL}/collections/elementerra_rabbits/listings?limit=1&listingAggMode=true`,
        {
          headers: {
            ...this.bearerTokenHeader,
          },
        },
      ),
    );
    const first: any = _.first(res.data);

    await this.saveNftListingResponse(first, 0);
  }

  private async fetchAndSaveCrystalPrice(level: number) {
    const res = await lastValueFrom(
      this.httpService.get(
        `${this.MAGIC_EDEN_BASE_URL}/collections/elementerra_crystals/listings?limit=1&listingAggMode=true&attributes=[[{"traitType":"level", "value":"${level}"}]]`,
        {
          headers: {
            ...this.bearerTokenHeader,
          },
        },
      ),
    );
    const first: any = _.first(res.data);

    await this.saveNftListingResponse(first, level);
  }

  private async fetchAndSaveChestPrice(tier: number) {
    const res = await lastValueFrom(
      this.httpService.get(
        `${this.MAGIC_EDEN_BASE_URL}/collections/elementerra_chests/listings?limit=1&listingAggMode=true&attributes=[[{"traitType":"tier", "value":"${tier}"}]]`,
        {
          headers: {
            ...this.bearerTokenHeader,
          },
        },
      ),
    );
    const first: any = _.first(res.data);

    await this.saveNftListingResponse(first, tier);
  }

  private async saveNftListingResponse(res: any, level: number) {
    if (!_.isNil(res)) {
      await this.nftPriceModel.create({
        mint: res.tokenMint,
        collection: res.token.collection,
        level,
        priceInSol: res.price,
        timestamp: Math.floor(new Date().getTime() / 1000),
      });
    }
  }
}
