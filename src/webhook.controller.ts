import { Body, Controller, Headers, Post } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ParsedTransaction } from './dto/ParsedTransaction';
import { checkAuthHeader } from './lib/auth';

@ApiTags('Data')
@Controller('helius-webhook')
export class WebhookController {
  constructor(private readonly appService: AppService) {}

  @Post('program')
  public async handleElementerraProgramTransactions(
    @Headers('Authorization') authHeader: string,
    @Body() transactionHistory: ParsedTransaction[],
  ) {
    checkAuthHeader(authHeader);
    await this.appService.processTransactionHistory(transactionHistory);
  }
}
