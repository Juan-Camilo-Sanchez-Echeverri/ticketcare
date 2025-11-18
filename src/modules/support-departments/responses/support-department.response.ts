import { OmitType, PickType } from '@nestjs/swagger';

import { SupportLevel } from '@modules/support-levels/schemas/support-level.schema';

import { SupportDepartment } from '../schemas/support-department.schema';

class SupportLevelSupportDepartmentResponse extends PickType(SupportLevel, [
  'name',
]) {
  /**
   * Identifier for the support level.
   */
  _id: string;
}

export class SupportDepartmentResponse extends OmitType(SupportDepartment, [
  'defaultLevel',
  'supportLevels',
] as const) {
  /**
   *   Identifier for the support department.
   */
  _id: string;

  /**
   *  List of associated support levels.
   */
  supportLevels: SupportLevelSupportDepartmentResponse[];
}
