import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as _ from 'lodash';
import { CompressedEvent, ParsedTransaction } from './dto/ParsedTransaction';
import { HeliusService } from './helius.service';
import { ELEMENTERRA_ELEMENTS_COLLECTION_ID } from './lib/constants';
import { Element } from './models/Element.model';

@Injectable()
export class ElementsService {
  constructor(
    @InjectModel(Element)
    private readonly elementModel: typeof Element,
    private readonly heliusService: HeliusService,
  ) {}

  public async replay(limit: number, before?: string): Promise<void> {
    const res = await this.heliusService.getAssetsByCollection(
      ELEMENTERRA_ELEMENTS_COLLECTION_ID,
      limit,
      before,
    );

    for (const element of res.items) {
      await this.saveElement(
        element.id,
        element.content?.metadata?.name,
        element.content?.metadata?.symbol,
      );
    }
  }

  public async processTransaction(
    transaction: ParsedTransaction,
  ): Promise<void> {
    if (!_.isNil(transaction.transactionError)) {
      return;
    }

    const compressedNftEvents: CompressedEvent[] | undefined = _.get(
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
