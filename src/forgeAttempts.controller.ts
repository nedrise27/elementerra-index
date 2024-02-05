import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { ForgeAttemptsService } from './forgeAttempts.service';
import { ForgeAttempt } from './models';

import * as _ from 'lodash';
import { checkAuthHeader } from './lib/auth';
import { ELEMENTERRA_PROGRAMM_ID } from './lib/constants';
import {
  ORDER_DIRECTIONS,
  getLimitOffsetFromPagination,
} from './lib/pagination';
import { ListForgeAttemptsRequest } from './requests/ListForgeAttemptsRequest';
import { ReplayForgeAttemptsRequest } from './requests/ReplayForgeAttemptsRequest';

@Controller('forge-attempts')
export class ForgeAttemptsController {
  constructor(private readonly forgeAttemptsService: ForgeAttemptsService) {}

  @Get()
  public async listForgeAttempts(
    @Query() query?: ListForgeAttemptsRequest,
  ): Promise<ForgeAttempt[]> {
    const { limit, offset } = getLimitOffsetFromPagination(
      query?.page,
      query?.size,
      10,
    );

    let order = 'desc';
    if (!_.isNil(query?.order)) {
      const o = query.order.toLowerCase();
      if (ORDER_DIRECTIONS.includes(o)) {
        order = o;
      }
    }

    return this.forgeAttemptsService.findAll(
      limit,
      offset,
      order,
      query?.guesser,
    );
  }

  @Post('replay')
  public async replayForgeAttempts(
    @Headers('Authorization') authHeader: string,
    @Body() request: ReplayForgeAttemptsRequest,
  ) {
    checkAuthHeader(authHeader);

    let account = ELEMENTERRA_PROGRAMM_ID;

    if (!_.isNil(request?.guesser)) {
      account = request.guesser;
    }

    const res = await this.forgeAttemptsService.replay(
      account,
      request.before,
      request.type,
    );

    console.log(res);

    return res;
  }
}
