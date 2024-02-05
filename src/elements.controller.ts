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
@Controller('elements')
export class ElementsController {
  constructor(private readonly elementsService: ElementsService) {}

  @Post('replay')
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
