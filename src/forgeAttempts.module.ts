import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ForgeAttemptsController } from 'src/forgeAttempts.controller';
import { ForgeAttemptsService } from 'src/forgeAttempts.service';
import { ElementsModule } from './elements.module';
import { HeliusModule } from './helius.module';
import { Element, ForgeAttempt, TransactionHistory } from './models';

@Module({
  imports: [
    SequelizeModule.forFeature([TransactionHistory, ForgeAttempt, Element]),
    ElementsModule,
    HeliusModule,
  ],
  providers: [ForgeAttemptsService],
  controllers: [ForgeAttemptsController],
  exports: [ForgeAttemptsService],
})
export class ForgeAttemptsModule {}
