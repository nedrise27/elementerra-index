import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GuessModel } from './models/Guess.model';
import { GuessesService } from './guesses.service';
import { GuessesController } from './guesses.controller';

@Module({
  imports: [SequelizeModule.forFeature([GuessModel])],
  providers: [GuessesService],
  controllers: [GuessesController],
  exports: [GuessesService],
})
export class GuessesModule {}
