import {
  Body,
  Headers,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import * as _ from 'lodash';

import { AppService } from './app.service';
import { ParsedTransaction } from './dto/ParsedTransaction';

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
    this.checkAuthHeader(authHeader);
    await this.appService.saveProgramTransactionHistory(transactionHistory);
  }

  @Post('helius-webhook/elements')
  public async handleElementsTransactions(
    @Headers('Authorization') authHeader: string,
    @Body() transactionHistory: ParsedTransaction[],
  ) {
    this.checkAuthHeader(authHeader);
    await this.appService.saveElementTransactionHistory(transactionHistory);
  }

  private checkAuthHeader(authHeader: string) {
    if (
      !_.isString(authHeader) ||
      authHeader != process.env.PAIN_TEXT_PASSWORD
    ) {
      throw new UnauthorizedException();
    }
  }
}
