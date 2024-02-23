import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { EventsConfigurationModel } from './models/EventsConfiguration.model';

@Module({
  imports: [SequelizeModule.forFeature([EventsConfigurationModel])],
  providers: [EventsService],
  controllers: [],
  exports: [EventsService],
})
export class EventsModule {}
