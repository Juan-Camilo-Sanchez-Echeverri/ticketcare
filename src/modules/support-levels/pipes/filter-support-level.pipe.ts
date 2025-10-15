import type { Request } from 'express';

import { REQUEST } from '@nestjs/core';

import { Inject, Injectable, PipeTransform } from '@nestjs/common';

import { SupportLevelDocument } from '../schemas/support-level.schema';

import { FilterDto } from '@common/dto';
import { Status } from '@common/enums';

@Injectable()
export class FilterSupportLevelPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: Request) {}
  transform(
    value: FilterDto<SupportLevelDocument>,
  ): FilterDto<SupportLevelDocument> {
    const contractor = this.request.params.contractorId;

    value.data = {
      businessContractor: contractor,
      status: Status.ACTIVE,
    };

    return value;
  }
}
