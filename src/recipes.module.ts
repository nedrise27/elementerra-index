import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Recipe } from './models/Recipe';
import { Element, ForgeAttempt } from './models';

@Module({
  imports: [SequelizeModule.forFeature([ForgeAttempt, Element, Recipe])],
  providers: [RecipesService],
  controllers: [RecipesController],
  exports: [RecipesService],
})
export class RecipesModule {}
