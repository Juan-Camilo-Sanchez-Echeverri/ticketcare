import type { Request } from 'express';

import { REQUEST } from '@nestjs/core';
import { Inject, Injectable, PipeTransform } from '@nestjs/common';

import { Status } from '@common/enums';

import { PaginationClientDto } from '../dto';

@Injectable()
export class FilterBusinessClientPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: Request) {}
  transform(value: PaginationClientDto): PaginationClientDto {
    const contractor = this.request.params.contractorId;

    value.data = {
      ...value.data,
      businessContractors: { $elemMatch: { $eq: contractor } },
      status: Status.ACTIVE,
    };

    return value;
  }
}
