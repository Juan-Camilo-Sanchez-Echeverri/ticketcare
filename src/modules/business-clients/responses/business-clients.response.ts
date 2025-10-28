import { OmitType, PickType } from '@nestjs/swagger';

import { BusinessContractorResponse } from '@modules/business-contractors/responses/business-contractor.response';

import { BusinessClient } from '../schemas/business-client.schema';

class ContractorBusinessClientResponse extends PickType(
  BusinessContractorResponse,
  ['_id', 'name'],
) {}

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
  businessContractors: ContractorBusinessClientResponse[];
}
