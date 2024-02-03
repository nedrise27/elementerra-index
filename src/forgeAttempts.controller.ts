import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ForgeAttemptsService } from './forgeAttempts.service';
import { ForgeAttempt } from './models';

import * as _ from 'lodash';

@Controller('forge-attempts')
export class ForgeAttemptsController {
  constructor(private readonly forgeAttemptsService: ForgeAttemptsService) {}

  @Get()
  async listForgeAttempts(@Query() query): Promise<ForgeAttempt[]> {
    const limit = _.min([100, query.limit]);
    return this.forgeAttemptsService.findAll(limit);
  }
}
