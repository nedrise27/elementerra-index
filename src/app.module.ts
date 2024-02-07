import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { MongooseModule } from '@nestjs/mongoose';
import { AdministrativeController } from './administrative.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ElementsModule } from './elements.module';
import { ForgeAttemptsModule } from './forgeAttempts.module';
import { HeliusModule } from './helius.module';
import { Element, ForgeAttempt } from './models';
import {
  TransactionHistory,
  TransactionHistorySchema,
} from './schemas/TransactionHistory.schema';
import { WebhookController } from './webhook.controller';

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
    MongooseModule.forRoot(
      `mongodb://${process.env.OBJECT_DATABASE_HOST}:${process.env.OBJECT_DATABASE_PORT}/${process.env.OBJECT_DATABASE_NAME}?authSource=admin`,
      {
        user: process.env.OBJECT_DATABASE_USERNAME,
        pass: process.env.OBJECT_DATABASE_PASSWORD,
      },
    ),
    SequelizeModule.forFeature([ForgeAttempt, Element]),
    MongooseModule.forFeature([
      { name: TransactionHistory.name, schema: TransactionHistorySchema },
    ]),
    ForgeAttemptsModule,
    ElementsModule,
    HeliusModule,
  ],
  controllers: [AppController, WebhookController, AdministrativeController],
  providers: [AppService],
})
export class AppModule {}
