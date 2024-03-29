import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ForgeAttemptsController } from 'src/forgeAttempts.controller';
import { ForgeAttemptsService } from 'src/forgeAttempts.service';
import { ElementsModule } from './elements.module';
import { HeliusModule } from './helius.module';
import { Element, ForgeAttempt, TransactionHistory } from './models';
import { RecipesModule } from './recipes.module';
import { EventsModule } from './events.module';
import { RecipeRequestLog } from './models/RecipeRequestLog';

@Module({
  imports: [
    SequelizeModule.forFeature([TransactionHistory, ForgeAttempt, Element]),
    ElementsModule,
    HeliusModule,
    RecipesModule,
    EventsModule,
  ],
  providers: [ForgeAttemptsService],
  controllers: [ForgeAttemptsController],
  exports: [ForgeAttemptsService],
})
export class ForgeAttemptsModule {}
