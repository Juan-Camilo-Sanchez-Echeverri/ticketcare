import { OmitType, PickType } from '@nestjs/swagger';

import { BusinessContractorResponse } from '@modules/business-contractors/responses/business-contractor.response';

import { SupportLevel } from '../schemas/support-level.schema';

class BusinessContractorSupportLevelResponse extends PickType(
  BusinessContractorResponse,
  ['_id', 'name'] as const,
) {}

export class SupportLevelResponse extends OmitType(SupportLevel, [
  'businessContractor',
] as const) {
  /**
   *  Identifier for the support level.
   */
  _id: string;

  /**
   *  Associated business contractor information.
   */
  businessContractor: BusinessContractorSupportLevelResponse;
}
