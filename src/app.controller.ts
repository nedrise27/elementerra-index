import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async showStats() {
    return this.appService.stats();
  }

  @Post('helius-webhook')
  async handleElementerraProgramTransaction(@Body() body: any) {
    console.log(body);
  }
}
