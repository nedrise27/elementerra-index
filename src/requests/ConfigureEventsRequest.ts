import { ApiProperty } from '@nestjs/swagger';

export class ConfigureEventsRequest {
  @ApiProperty()
  guesser: string;

  @ApiProperty()
  enableEvents: boolean;
}
