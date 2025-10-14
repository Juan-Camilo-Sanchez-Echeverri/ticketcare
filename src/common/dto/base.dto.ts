import { ApiHideProperty } from '@nestjs/swagger';

import { Allow } from 'class-validator';

export class BaseDto {
  /**
   *  The user created resource.
   */
  @Allow()
  @ApiHideProperty()
  modifiedBy: string | null;
}
