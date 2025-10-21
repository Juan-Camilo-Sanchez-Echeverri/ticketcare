import type { Request } from 'express';

import { REQUEST } from '@nestjs/core';

import { Inject, Injectable, PipeTransform } from '@nestjs/common';

import { UserRole } from '@common/enums';

import { extractUserFromRequest } from '@common/helpers';

import { PaginationTicketDto } from '../dto';

@Injectable()
export class FilterTicketsUnassignedPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: Request) {}
  transform(value: PaginationTicketDto) {
    const user = extractUserFromRequest(this.request);

    value.data = {
      assignedUser: { $exists: false },
    };

    if (user.role === UserRole.Agent) {
      value.data = {
        ...value.data,

        supportDepartment: user.details.supportDepartments?.map(
          (department) => department._id,
        ),

        supportLevel: user.details.supportLevels?.map((level) => level._id),
      };
    }

    return value;
  }
}
