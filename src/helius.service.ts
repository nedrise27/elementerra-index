import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Helius } from 'helius-sdk';

@Injectable()
export class HeliusService {
  private readonly helius: Helius;

  constructor(private readonly httpService: HttpService) {
    this.helius = new Helius(process.env.HELIUS_API_KEY);
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
}
