import { ApiProperty } from '@nestjs/swagger';
import { ElementNames } from 'src/lib/elements';

export class CheckRecipeRequest {
  @ApiProperty({
    type: 'array',
    enum: ElementNames,
    isArray: true,
    enumName: 'ElementNames',
    minLength: 4,
    maxLength: 4,
    example: [
      ElementNames.air,
      ElementNames.earth,
      ElementNames.earth,
      ElementNames.earth,
    ],
  })
  elements: string[];
}
