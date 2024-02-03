import { Controller, Post } from '@nestjs/common';

@Controller('elements')
export class ElementsController {
  @Post()
  addElements(): string {
    return 'Unimplemented';
  }
}
