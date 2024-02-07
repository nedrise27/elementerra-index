import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SequelizeModule } from '@nestjs/sequelize';
import { ForgeAttemptsController } from 'src/forgeAttempts.controller';
import { ForgeAttemptsService } from 'src/forgeAttempts.service';
import { ElementsModule } from './elements.module';
import { HeliusModule } from './helius.module';
import { Element } from './models';
import { ForgeAttempt } from './models/ForgeAttempt.model';
import {
  TransactionHistory,
  TransactionHistorySchema,
} from './schemas/TransactionHistory.schema';

@Module({
  imports: [
    SequelizeModule.forFeature([ForgeAttempt, Element]),
    MongooseModule.forFeature([
      { name: TransactionHistory.name, schema: TransactionHistorySchema },
    ]),
    ElementsModule,
    HeliusModule,
  ],
  providers: [ForgeAttemptsService],
  controllers: [ForgeAttemptsController],
  exports: [ForgeAttemptsService],
})
export class ForgeAttemptsModule {}
