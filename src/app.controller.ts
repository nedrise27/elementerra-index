import { Body, Controller, Get, Headers, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { ParsedTransaction } from './dto/ParsedTransaction';
import { checkAuthHeader } from './lib/auth';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public async showStats() {
    return this.appService.stats();
  }

  @Post('helius-webhook/program')
  public async handleElementerraProgramTransactions(
    @Headers('Authorization') authHeader: string,
    @Body() transactionHistory: ParsedTransaction[],
  ) {
    checkAuthHeader(authHeader);
    await this.appService.saveProgramTransactionHistory(transactionHistory);
  }

  @Post('helius-webhook/elements')
  public async handleElementsTransactions(
    @Headers('Authorization') authHeader: string,
    @Body() transactionHistory: ParsedTransaction[],
  ) {
    checkAuthHeader(authHeader);
    await this.appService.saveElementTransactionHistory(transactionHistory);
  }
}
