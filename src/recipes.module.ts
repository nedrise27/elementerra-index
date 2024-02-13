import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Element, ForgeAttempt } from './models';
import { GuessModel } from './models/Guess.model';

@Module({
  imports: [SequelizeModule.forFeature([ForgeAttempt, Element, GuessModel])],
  providers: [RecipesService],
  controllers: [RecipesController],
  exports: [RecipesService],
})
export class RecipesModule {}
