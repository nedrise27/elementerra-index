import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ElementsController } from './elements.controller';
import { ElementsService } from './elements.service';
import { Element } from './models/Element.model';

@Module({
  imports: [SequelizeModule.forFeature([Element])],
  providers: [ElementsService],
  controllers: [ElementsController],
})
export class ElementsModule {}
