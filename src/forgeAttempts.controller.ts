import { Controller, Get, Query } from '@nestjs/common';
import { ForgeAttemptsService } from './forgeAttempts.service';
import { ForgeAttempt } from './models';

import { getLimitOffsetFromPagination } from './lib/pagination';
import { ListRequest } from './requests/ListRequest';

@Controller('forge-attempts')
export class ForgeAttemptsController {
  constructor(private readonly forgeAttemptsService: ForgeAttemptsService) {}

  @Get()
  async listForgeAttempts(
    @Query() query?: ListRequest,
  ): Promise<ForgeAttempt[]> {
    const { limit, offset } = getLimitOffsetFromPagination(
      query?.page,
      query?.size,
      10,
    );
    return this.forgeAttemptsService.findAll(limit, offset);
  }
}
