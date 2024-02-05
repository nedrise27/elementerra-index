import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as _ from 'lodash';
import { AppService } from './app.service';
import { checkAuthHeader } from './lib/auth';
import { ELEMENTERRA_PROGRAMM_ID } from './lib/constants';
import { ReplayForgeAttemptsRequest } from './requests/ReplayForgeAttemptsRequest';
import { ReplayResponse } from './responses/ReplayResponse';

@ApiTags('Administrative')
@Controller('replay')
export class AdministrativeController {
  constructor(private readonly appService: AppService) {}

  @Post('')
  public async replayForgeAttempts(
    @Headers('Authorization') authHeader: string,
    @Body() request: ReplayForgeAttemptsRequest,
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
}
