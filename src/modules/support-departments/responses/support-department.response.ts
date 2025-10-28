import { OmitType, PickType } from '@nestjs/swagger';

import { BusinessContractorResponse } from '@modules/business-contractors/responses/business-contractor.response';
import { SupportLevel } from '@modules/support-levels/schemas/support-level.schema';

import { SupportDepartment } from '../schemas/support-department.schema';

class ContractorSupportDepartmentResponse extends PickType(
  BusinessContractorResponse,
  ['_id', 'name'],
) {}

class SupportLevelSupportDepartmentResponse extends PickType(SupportLevel, [
  'name',
]) {
  /**
   * Identifier for the support level.
   */
  _id: string;
}

export class SupportDepartmentResponse extends OmitType(SupportDepartment, [
  'businessContractor',
  'defaultLevel',
  'supportLevels',
] as const) {
  /**
   *   Identifier for the support department.
   */
  _id: string;

  /**
   *  Associated business contractor information.
   */
  businessContractor: ContractorSupportDepartmentResponse;

  /**
   *  List of associated support levels.
   */
  supportLevels: SupportLevelSupportDepartmentResponse[];
}
