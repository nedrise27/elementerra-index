import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as _ from 'lodash';
import { CompressedEvent, ParsedTransaction } from './dto/ParsedTransaction';
import { HeliusService } from './helius.service';
import { ELEMENTERRA_ELEMENTS_COLLECTION_ID } from './lib/constants';
import { Element } from './models/Element.model';
import { ReplayElementsResponse } from './responses/ReplayElementsResponse';
import { CompressedNftEvent, EnrichedTransaction } from 'helius-sdk';

@Injectable()
export class ElementsService {
  constructor(
    @InjectModel(Element)
    private readonly elementModel: typeof Element,
    private readonly heliusService: HeliusService,
  ) {}

  public async replay(
    limit?: number,
    page?: number,
  ): Promise<ReplayElementsResponse> {
    const l = _.min([limit, 1000]);
    const p = _.max([page, 1]);

    const res = await this.heliusService.getAssetsByCollection(
      ELEMENTERRA_ELEMENTS_COLLECTION_ID,
      l,
      p,
    );

    if (_.isNil(res?.items) || _.isEmpty(res?.items)) {
      throw new Error(
        `Could not find elments for collection ${ELEMENTERRA_ELEMENTS_COLLECTION_ID} limit ${l} page ${p}`,
      );
    }

    await this.elementModel.bulkCreate(
      res.items.map((i) => ({
        id: i.id,
        name: i.content?.metadata?.name,
        symbol: i.content?.metadata?.symbol,
      })),
      { ignoreDuplicates: true },
    );

    const first = _.first(res?.items);
    const last = _.last(res?.items);

    return {
      firstId: first?.id,
      lastId: last?.id,
      limit: res.limit,
      page: res.page,
      total: res.total,
    };
  }

  public async processTransaction(
    transaction: EnrichedTransaction,
  ): Promise<void> {
    if (!_.isNil(transaction.transactionError)) {
      return;
    }

    const compressedNftEvents: CompressedNftEvent[] | undefined = _.get(
      transaction.events,
      'compressed',
    );

    if (_.isNil(compressedNftEvents) || _.isEmpty(compressedNftEvents)) {
      return;
    }

    for (const compressedNftEvent of compressedNftEvents) {
      const id = compressedNftEvent.assetId;

      const metadata = compressedNftEvent.metadata;

      if (!_.isNil(metadata)) {
        await this.saveElement(id, metadata.name, metadata.symbol);
        return;
      }

      await this.findOrFetchAndSaveElement(id);
    }
  }

  public async findOrFetchAndSaveElement(
    id: string,
  ): Promise<Element | undefined> {
    const foundAsset = await this.elementModel.findOne({ where: { id } });

    if (!_.isNil(foundAsset)) {
      return foundAsset;
    }

    const asset = await this.heliusService.getAssetById(id);

    if (!_.isNil(asset)) {
      return this.saveElement(
        id,
        asset.content.metadata.name,
        asset.content.metadata.symbol,
      );
    }
  }

  private async saveElement(
    id: string,
    name: string,
    symbol: string,
  ): Promise<Element> {
    const [element] = await this.elementModel.upsert({
      id,
      name,
      symbol,
    });
    return element;
  }
}
