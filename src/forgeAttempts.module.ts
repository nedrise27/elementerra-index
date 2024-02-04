import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ForgeAttempt } from './models/ForgeAttempt.model';
import { ForgeAttemptsService } from 'src/forgeAttempts.service';
import { ForgeAttemptsController } from 'src/forgeAttempts.controller';

@Module({
  imports: [SequelizeModule.forFeature([ForgeAttempt])],
  providers: [ForgeAttemptsService],
  controllers: [ForgeAttemptsController],
  exports: [ForgeAttemptsService],
})
export class ForgeAttemptsModule {}
