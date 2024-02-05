import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Element } from './models/Element.model';
import { CompressedEvent, ParsedTransaction } from './dto/ParsedTransaction';
import * as _ from 'lodash';
import { HeliusService } from './helius.service';

@Injectable()
export class ElementsService {
  constructor(
    @InjectModel(Element)
    private readonly elementModel: typeof Element,
    private readonly heliusService: HeliusService,
  ) {}

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

      const foundAsset = await this.elementModel.findOne({ where: { id } });

      if (!_.isNil(foundAsset)) {
        return;
      }

      const asset = await this.heliusService.getAssetById(id);

      if (!_.isNil(asset)) {
        await this.saveElement(
          id,
          asset.content.metadata.name,
          asset.content.metadata.symbol,
        );
        await this.elementModel.upsert({
          id,
          name: asset.content.metadata.name,
          symbol: asset.content.metadata.symbol,
        });
      }
    }
  }

  private async saveElement(
    id: string,
    name: string,
    symbol: string,
  ): Promise<void> {
    await this.elementModel.upsert({
      id,
      name,
      symbol,
    });
  }
}
