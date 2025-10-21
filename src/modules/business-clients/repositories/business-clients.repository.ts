import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import type { PaginateModel } from 'mongoose';

import { EntityRepository } from '@common/database';

import {
  BusinessClient,
  BusinessClientDocument,
} from '../schemas/business-client.schema';

@Injectable()
export class BusinessClientsRepository extends EntityRepository<BusinessClientDocument> {
  constructor(
    @InjectModel(BusinessClient.name)
    protected readonly businessClientModel: PaginateModel<BusinessClientDocument>,
  ) {
    super(businessClientModel);
  }
}
