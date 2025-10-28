import { InjectModel } from '@nestjs/mongoose';

import type { PaginateModel } from 'mongoose';

import { EntityRepository } from '@common/database';

import {
  SupportDepartment,
  SupportDepartmentDocument,
} from '../schemas/support-department.schema';

export class SupportDepartmentsRepository extends EntityRepository<SupportDepartmentDocument> {
  constructor(
    @InjectModel(SupportDepartment.name)
    protected supportDepartmentModel: PaginateModel<SupportDepartmentDocument>,
  ) {
    super(supportDepartmentModel);
  }
}
