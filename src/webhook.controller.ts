import { Body, Controller, Headers, Post } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { EnrichedTransaction } from 'helius-sdk';
import * as _ from 'lodash';
import { AppService } from './app.service';
import { checkAuthHeader } from './lib/auth';

@ApiTags('Data')
@Controller('helius-webhook')
export class WebhookController {
  constructor(private readonly appService: AppService) {}

  @Post('program')
  public async handleElementerraProgramTransactions(
    @Headers('Authorization') authHeader: string,
    @Body() transactionHistory: EnrichedTransaction | EnrichedTransaction[],
  ) {
    checkAuthHeader(authHeader);
    const transactions = _.isArray(transactionHistory)
      ? transactionHistory
      : [transactionHistory];

    await this.appService.processTransactionHistory(transactions);
  }
}
