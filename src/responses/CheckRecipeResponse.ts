import { ApiProperty } from '@nestjs/swagger';

export class CheckRecipeResponse {
  @ApiProperty()
  wasTried: boolean;

  @ApiProperty()
  wasSuccessful: boolean | null;

  constructor(wasTried: boolean, wasSuccessful: boolean | null) {
    this.wasTried = wasTried;
    this.wasSuccessful = wasSuccessful;
  }
}
