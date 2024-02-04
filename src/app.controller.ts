import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ParsedTransaction } from './dto/ParsedTransaction';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async showStats() {
    return this.appService.stats();
  }

  @Post('helius-webhook')
  async handleElementerraProgramTransaction(
    @Body() transactionHistory: ParsedTransaction[],
  ) {
    this.appService.saveProgramTransactionHistory(transactionHistory);
  }
}
