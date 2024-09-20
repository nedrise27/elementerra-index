import { Body, Controller, Headers, Post } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { EnrichedTransaction } from 'helius-sdk';
import { AppService } from './app.service';
import { checkAuthHeader } from './lib/auth';
import { Guess } from 'clients/elementerra-program/accounts';
import _ from 'lodash';
import { ELEMENTERRA_PROGRAM_CLAIM_PENDING_GUESS_DATA } from './lib/constants';

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
