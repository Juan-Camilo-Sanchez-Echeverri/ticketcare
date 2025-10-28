import { EntityRepository } from '@common/database';

import { InjectModel } from '@nestjs/mongoose';

import type { PaginateModel } from 'mongoose';

import {
  BusinessContractor,
  BusinessContractorDocument,
} from '../schemas/business-contractor.schema';

export class BusinessContractorsRepository extends EntityRepository<BusinessContractorDocument> {
  constructor(
    @InjectModel(BusinessContractor.name)
    protected readonly businessContractorModel: PaginateModel<BusinessContractorDocument>,
  ) {
    super(businessContractorModel);
  }
}
