import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Element, ForgeAttempt } from './models';
import { GuessModel } from './models/Guess.model';
import { RecipeRequestLog } from './models/RecipeRequestLog';
import { HeliusModule } from './helius.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    SequelizeModule.forFeature([
      ForgeAttempt,
      Element,
      GuessModel,
      RecipeRequestLog,
    ]),
    HeliusModule,
  ],
  providers: [RecipesService],
  controllers: [RecipesController],
  exports: [RecipesService],
})
export class RecipesModule {}
