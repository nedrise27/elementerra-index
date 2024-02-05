import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ElementsController } from './elements.controller';
import { ElementsService } from './elements.service';
import { Element } from './models/Element.model';
import { HeliusModule } from './helius.module';

@Module({
  imports: [SequelizeModule.forFeature([Element]), HeliusModule],
  providers: [ElementsService],
  controllers: [ElementsController],
  exports: [ElementsService],
})
export class ElementsModule {}
