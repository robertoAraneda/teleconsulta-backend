import { Controller, Get } from '@nestjs/common';
import { AppService, DefaultRoute } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  default(): DefaultRoute {
    return this.appService.default();
  }
}
