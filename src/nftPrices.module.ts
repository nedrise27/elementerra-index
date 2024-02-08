import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { NftPrice } from './models/NftPrice.model';
import { NftPricesService } from './nftPrices.service';
import { NftPricesController } from './nftPrices.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    SequelizeModule.forFeature([NftPrice]),
    HttpModule,
  ],
  providers: [NftPricesService],
  controllers: [NftPricesController],
  exports: [NftPricesService],
})
export class NftPricesModule {}
