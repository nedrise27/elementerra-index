import { ApiProperty } from '@nestjs/swagger';
import { ElementName } from 'src/lib/elements';

export class GetGuessRequest {
  @ApiProperty({
    type: 'array',
    enum: ElementName,
    isArray: true,
    enumName: 'ElementName',
    minLength: 4,
    maxLength: 4,
    example: [
      ElementName.pebble,
      ElementName.compression,
      ElementName.compression,
      ElementName.compression,
    ],
  })
  recipe: string[];
}
