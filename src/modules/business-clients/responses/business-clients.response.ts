import { OmitType, PickType } from '@nestjs/swagger';

import { BusinessContractor } from '@modules/business-contractors/schemas/business-contractor.schema';

import { BusinessClient } from '../schemas/business-client.schema';

class BusinessContractorResponse extends PickType(BusinessContractor, [
  'name',
]) {
  /**   *  Identifier for the business contractor.
   */
  _id: string;
}

export class BusinessClientResponse extends OmitType(BusinessClient, [
  'businessContractors',
] as const) {
  /**
   *  Identifier for the business client.
   */
  _id: string;

  /**
   *  List of associated business contractors.
   */
  businessContractors: BusinessContractorResponse[];
}
