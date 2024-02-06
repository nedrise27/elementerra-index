import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ElementsModule } from './elements.module';
import { Element, ForgeAttempt } from './models';
import { ForgeAttemptsModule } from './forgeAttempts.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TransactionHistory,
  TransactionHistorySchema,
} from './schemas/TransactionHistory.schema';
import { AddToPendingGuess } from './models/AddToPendingGuess.model';
import { WebhookController } from './webhook.controller';
import { AdministrativeController } from './administrative.controller';
import { HeliusModule } from './helius.module';

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
    SequelizeModule.forFeature([ForgeAttempt, Element, AddToPendingGuess]),
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
