import { ApiProperty } from '@nestjs/swagger';
import { ElementName } from 'src/lib/elements';

export class CheckRecipeRequest {
  @ApiProperty({
    type: 'array',
    enum: ElementName,
    isArray: true,
    enumName: 'ElementName',
    minLength: 4,
    maxLength: 4,
    example: [
      ElementName.pebble,
      ElementName.pebble,
      ElementName.compression,
      ElementName.compression,
    ],
  })
  elements: string[];
}
