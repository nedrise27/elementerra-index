import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { AdministrativeController } from './administrative.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ElementsModule } from './elements.module';
import { ForgeAttemptsModule } from './forgeAttempts.module';
import { HeliusModule } from './helius.module';
import {
  Element,
  ForgeAttempt,
  TransactionHistory as TransactionHistoryModel,
} from './models';
import { WebhookController } from './webhook.controller';
import { NftPricesModule } from './nftPrices.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.RELATIONAL_DATABASE_HOST,
      port: parseInt(process.env.RELATIONAL_DATABASE_PORT, 10),
      username: process.env.RELATIONAL_DATABASE_USERNAME,
      password: process.env.RELATIONAL_DATABASE_PASSWORD,
      database: process.env.RELATIONAL_DATABASE_NAME,
      autoLoadModels: true,
      logging: false,
    }),
    SequelizeModule.forFeature([
      TransactionHistoryModel,
      ForgeAttempt,
      Element,
    ]),
    ForgeAttemptsModule,
    ElementsModule,
    HeliusModule,
    NftPricesModule,
  ],
  controllers: [AppController, WebhookController, AdministrativeController],
  providers: [AppService],
})
export class AppModule {}
