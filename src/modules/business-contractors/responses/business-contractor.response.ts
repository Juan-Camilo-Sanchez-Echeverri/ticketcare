import { BusinessContractor } from '../schemas/business-contractor.schema';

export class BusinessContractorResponse extends BusinessContractor {
  /**
   *  Identifier for the business contractor.
   */
  _id: string;
}
