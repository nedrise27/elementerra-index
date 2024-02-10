import { ApiProperty } from '@nestjs/swagger';
import { ElementNames } from 'src/lib/elements';

export class GetAvailableRecipesRequest {
  @ApiProperty({
    type: 'array',
    enum: ElementNames,
    isArray: true,
    enumName: 'ElementNames',
    example: [
      ElementNames.water,
      ElementNames.energy,
      ElementNames.life,
      ElementNames.heat,
      ElementNames.time,
      ElementNames.glass,
      ElementNames.seed,
    ],
  })
  elements: string[];

  @ApiProperty({
    type: 'integer',
    minimum: 1,
    maximum: 7,
    example: 3,
  })
  tier: number;
}
