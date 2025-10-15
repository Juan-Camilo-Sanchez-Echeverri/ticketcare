import type { Request } from 'express';

import { REQUEST } from '@nestjs/core';

import { Inject, Injectable, PipeTransform } from '@nestjs/common';

import { SupportDepartmentDocument } from '../schemas/support-department.schema';

import { FilterDto } from '@common/dto';
import { Status } from '@common/enums';

@Injectable()
export class FilterSupportDepartmentPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: Request) {}
  transform(
    value: FilterDto<SupportDepartmentDocument>,
  ): FilterDto<SupportDepartmentDocument> {
    const contractor = this.request.params.contractorId;

    value.data = {
      businessContractor: contractor,
      status: Status.ACTIVE,
    };

    return value;
  }
}
