import { InjectModel } from '@nestjs/mongoose';

import type { PaginateModel } from 'mongoose';

import { EntityRepository } from '@common/database/entity.repository';

import {
  SupportLevel,
  SupportLevelDocument,
} from '../schemas/support-level.schema';

export class SupportLevelsRepository extends EntityRepository<SupportLevelDocument> {
  constructor(
    @InjectModel(SupportLevel.name)
    protected readonly supportLevelModel: PaginateModel<SupportLevelDocument>,
  ) {
    super(supportLevelModel);
  }
}
