import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ForgeAttemptsService } from './forgeAttempts.service';
import { ForgeAttempt } from './models';

import * as _ from 'lodash';
import {
  ORDER_DIRECTIONS,
  getLimitOffsetFromPagination,
} from './lib/pagination';
import { ListForgeAttemptsRequest } from './requests/ListForgeAttemptsRequest';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Forge Attempts')
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
      100,
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
      query?.beforeTimestamp,
    );
  }

  @Get(':signature')
  public async getForgeAttempt(
    @Param() { signature }: { signature: string },
  ): Promise<ForgeAttempt> {
    console.log(signature);
    if (!_.isString(signature)) {
      throw new BadRequestException(
        `Please provite a signature as path parameter. Got: "${signature}"`,
      );
    }

    return this.forgeAttemptsService.findOne(signature);
  }
}
