import { OmitType } from '@nestjs/swagger';

import { SupportLevel } from '../schemas/support-level.schema';

export class SupportLevelResponse extends OmitType(SupportLevel, [] as const) {
  /**
   *  Identifier for the support level.
   */
  _id: string;
}
