import { Controller, Get } from '@nestjs/common';

import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { StatsResponse } from './responses/StatsResponse';

@ApiTags('Stats')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiResponse({
    type: StatsResponse,
  })
  @Get()
  public async showStats(): Promise<StatsResponse> {
    return this.appService.stats();
  }
}
