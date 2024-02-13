import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { Helius } from 'helius-sdk';
import * as _ from 'lodash';
import { lastValueFrom } from 'rxjs';
import { ParsedTransaction } from './dto/ParsedTransaction';

@Injectable()
export class HeliusService {
  private readonly helius: Helius;
  public readonly connection: Connection;

  constructor(private readonly httpService: HttpService) {
    this.helius = new Helius(process.env.HELIUS_API_KEY);
    this.connection = new Connection(
      process.env.SOLANA_RPC_ENDPOINT || clusterApiUrl('mainnet-beta'),
    );
  }

  public async getAssetById(assetId: string) {
    return this.helius.rpc.getAsset({
      id: assetId,
      displayOptions: {
        showCollectionMetadata: true,
        showUnverifiedCollections: true,
      },
    });
  }

  public async getSignaturesForAddress(
    owner: string,
    limit?: number,
    before?: string,
    type?: string,
  ): Promise<ParsedTransaction[]> {
    const l = _.min([100, limit]);
    const url = `https://api.helius.xyz/v0/addresses/${owner}/transactions`;
    const params = {
      'api-key': process.env.HELIUS_API_KEY,
      limit: l,
    };
    if (!_.isNil(before)) {
      params['before'] = before;
    }
    if (!_.isNil(type)) {
      params['type'] = type;
    }

    const res = await lastValueFrom(
      this.httpService.get(url, {
        params,
      }),
    );

    return res.data;
  }

  public async getAssetsByCollection(
    collection: string,
    limit: number,
    page?: number,
  ) {
    return this.helius.rpc.getAssetsByGroup({
      groupKey: 'collection',
      groupValue: collection,
      page,
      limit,
    });
  }
}
