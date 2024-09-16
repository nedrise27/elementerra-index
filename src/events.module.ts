import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { EventsConfigurationModel } from './models/EventsConfiguration.model';
import { Element } from './models';
import { HeliusModule } from './helius.module';
import { RecipesModule } from './recipes.module';

@Module({
  imports: [
    SequelizeModule.forFeature([EventsConfigurationModel]),
    HeliusModule,
    RecipesModule,
  ],
  providers: [EventsService],
  controllers: [],
  exports: [EventsService],
})
export class EventsModule {}
