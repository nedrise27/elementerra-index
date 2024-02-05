import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ForgeAttempt } from './models/ForgeAttempt.model';
import { ForgeAttemptsService } from 'src/forgeAttempts.service';
import { ForgeAttemptsController } from 'src/forgeAttempts.controller';
import { AddToPendingGuess } from './models/AddToPendingGuess.model';
import { ElementsModule } from './elements.module';
import { HeliusModule } from './helius.module';
import { Element } from './models';

@Module({
  imports: [
    SequelizeModule.forFeature([ForgeAttempt, AddToPendingGuess, Element]),
    ElementsModule,
    HeliusModule,
  ],
  providers: [ForgeAttemptsService],
  controllers: [ForgeAttemptsController],
  exports: [ForgeAttemptsService],
})
export class ForgeAttemptsModule {}
