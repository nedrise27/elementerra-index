import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HeliusService } from './helius.service';

@Module({
  imports: [HttpModule],
  providers: [HeliusService],
  exports: [HeliusService],
})
export class HeliusModule {}
