import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
} from '@nestjs/common';
import { ForgeAttemptsService } from './forgeAttempts.service';
import { ForgeAttempt } from './models';

import { getLimitOffsetFromPagination } from './lib/pagination';
import { ListForgeAttemptsRequest } from './requests/ListForgeAttemptsRequest';
import { ReplayForgeAttemptsRequest } from './requests/ReplayForgeAttemptsRequest';
import { checkAuthHeader } from './lib/auth';
import * as _ from 'lodash';

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
    return this.forgeAttemptsService.findAll(limit, offset, query?.guesser);
  }

  @Post('replay')
  public async replayForgeAttempts(
    @Headers('Authorization') authHeader: string,
    @Body() request: ReplayForgeAttemptsRequest,
  ) {
    checkAuthHeader(authHeader);

    if (!_.has(request, 'guesser')) {
      throw new BadRequestException(
        "Please provide attribute 'guesser' in request payload",
      );
    }

    await this.forgeAttemptsService.replay(request.guesser);
  }
}
