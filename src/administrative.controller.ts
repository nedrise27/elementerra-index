import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';
import { ElementsService } from './elements.service';
import { ReplayElementsRequest } from './requests/ReplayElementsRequest';
import { checkAuthHeader } from './lib/auth';
import * as _ from 'lodash';
import { ApiTags } from '@nestjs/swagger';
import { ReplayForgeAttemptsRequest } from './requests/ReplayForgeAttemptsRequest';
import { ELEMENTERRA_PROGRAMM_ID } from './lib/constants';
import { ForgeAttemptsService } from './forgeAttempts.service';
import { ReplayResponse } from './responses/ReplayResponse';

@ApiTags('Administrative')
@Controller('replay')
export class AdministrativeController {
  constructor(
    private readonly elementsService: ElementsService,
    private readonly forgeAttemptsService: ForgeAttemptsService,
  ) {}

  @Post('program')
  public async replayForgeAttempts(
    @Headers('Authorization') authHeader: string,
    @Body() request: ReplayForgeAttemptsRequest,
  ): Promise<ReplayResponse> {
    checkAuthHeader(authHeader);

    let account = _.clone(ELEMENTERRA_PROGRAMM_ID);

    if (!_.isNil(request?.guesser)) {
      account = request.guesser;
    }

    const res = await this.forgeAttemptsService.replay(
      account,
      request.before,
      request.type,
    );

    return res;
  }

  @Post('elements')
  public async replayElements(
    @Headers('Authorization') authHeader: string,
    @Body() request: ReplayElementsRequest,
  ): Promise<void> {
    checkAuthHeader(authHeader);
    if (_.isNil(request) || _.isNil(request?.limit)) {
      throw new BadRequestException(
        'Please provide at least attribute "limi" in request payload',
      );
    }

    return this.elementsService.replay(request.limit, request.before);
  }
}
