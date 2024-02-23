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
import { ConfigureEventsRequest } from './requests/ConfigureEventsRequest';
import { ConfigureEventsResponse } from './responses/ConfigureEventsResponse';
import { EventsService } from './events.service';

@ApiTags('Administrative')
@Controller('')
export class AdministrativeController {
  constructor(
    private readonly appService: AppService,
    private readonly eventsService: EventsService,
  ) {}

  @Post('replay')
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

  @Post('/replay/forge-attempts')
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

  @Post('/replay/elements')
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

  @Post('/replay/recipes')
  public async replayRecipes(@Headers('Authorization') authHeader: string) {
    checkAuthHeader(authHeader);

    return this.appService.replayRecipes();
  }

  @Post('/configure/events')
  public async configureEvents(
    @Headers('Authorization') authHeader: string,
    @Body() request: ConfigureEventsRequest,
  ): Promise<ConfigureEventsResponse> {
    checkAuthHeader(authHeader);

    console.log(request);
    return this.eventsService.configureEvents(request);
  }
}
