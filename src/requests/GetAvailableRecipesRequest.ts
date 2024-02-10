import { ApiProperty } from '@nestjs/swagger';
import { ElementName } from 'src/lib/elements';

export class GetAvailableRecipesRequestElement {
  @ApiProperty({
    type: 'string',
    enum: ElementName,
    enumName: 'ElementName',
    example: ElementName.time,
  })
  element: ElementName;

  @ApiProperty({
    type: 'integer',
    minimum: 0,
    maximum: 4,
    default: 0,
  })
  minAmount: number;

  @ApiProperty({
    type: 'integer',
    minimum: 1,
    maximum: 4,
    default: 4,
  })
  maxAmount: number;
}

export class GetAvailableRecipesRequest {
  @ApiProperty({
    type: [GetAvailableRecipesRequestElement],
    example: [
      { element: ElementName.time, minAmount: 1, maxAmount: 4 },
      { element: ElementName.dust, minAmount: 0, maxAmount: 4 },
      { element: ElementName.pressure, minAmount: 0, maxAmount: 4 },
      { element: ElementName.heat, minAmount: 0, maxAmount: 4 },
      { element: ElementName.air, minAmount: 0, maxAmount: 4 },
    ],
  })
  elements: GetAvailableRecipesRequestElement[];

  @ApiProperty({
    type: 'integer',
    minimum: 1,
    maximum: 7,
    example: 3,
  })
  tier: number;
}
