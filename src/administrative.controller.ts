import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as _ from 'lodash';
import { AppService } from './app.service';
import { checkAuthHeader } from './lib/auth';
import { ELEMENTERRA_PROGRAMM_ID } from './lib/constants';
import { ReplayElementsRequest } from './requests/ReplayElementsRequest';
import {
  ReplayForgeAttemptsRequest,
  ReplayTransactionHistoryRequest,
} from './requests/ReplayForgeAttemptsRequest';
import { ReplayElementsResponse } from './responses/ReplayElementsResponse';
import { ReplayResponse } from './responses/ReplayResponse';

@ApiTags('Administrative')
@Controller('replay')
export class AdministrativeController {
  constructor(private readonly appService: AppService) {}

  @Post('')
  public async replayTransactionHistory(
    @Headers('Authorization') authHeader: string,
    @Body() request: ReplayTransactionHistoryRequest,
  ): Promise<ReplayResponse> {
    checkAuthHeader(authHeader);

    let account = _.clone(ELEMENTERRA_PROGRAMM_ID);

    if (!_.isNil(request?.guesser)) {
      account = request.guesser;
    }

    const res = await this.appService.replay(
      account,
      request.before,
      request.type,
    );

    return res;
  }

  @Post('/forge-attempts')
  public async replayForgeAttempts(
    @Headers('Authorization') authHeader: string,
    @Body() request: ReplayForgeAttemptsRequest,
  ): Promise<ReplayResponse> {
    checkAuthHeader(authHeader);

    const res = await this.appService.replayForgeAttempts(
      request?.limit,
      request?.guesser,
      request?.afterSlot,
    );

    return res;
  }

  @Post('/elements')
  public async replayElements(
    @Headers('Authorization') authHeader: string,
    @Body() request: ReplayElementsRequest,
  ): Promise<ReplayElementsResponse> {
    checkAuthHeader(authHeader);

    const res = await this.appService.replayElements(
      request?.limit,
      request?.page,
    );

    return res;
  }

  @Post('/recipes')
  public async replayRecipes(@Headers('Authorization') authHeader: string) {
    checkAuthHeader(authHeader);

    return this.appService.replayRecipes();
  }
}
