import type { Request } from 'express';

import { REQUEST } from '@nestjs/core';

import {
  Injectable,
  PipeTransform,
  Inject,
  BadRequestException,
} from '@nestjs/common';

import { extractUserFromRequest } from '@common/helpers';

import { SupportDepartmentsService } from '@modules/support-departments/support-departments.service';

import { CreateTicketDto } from '../dto';

@Injectable()
export class ValidationTicketPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly departmentsService: SupportDepartmentsService,
  ) {}

  async transform(value: CreateTicketDto): Promise<CreateTicketDto> {
    const { supportDepartment, businessContractor } = value;

    const requestingUser = extractUserFromRequest(this.request);

    const department = await this.departmentsService.findOneByQuery({
      _id: supportDepartment,
      businessContractor: businessContractor!,
    });

    if (!department) {
      throw new BadRequestException('Department not found for this contractor');
    }

    this.departmentsService.checkStatus(department);

    const supportLevel = String(department.defaultLevel._id);

    value = {
      ...value,
      requestingUser: String(requestingUser._id),
      businessContractor,
      supportLevel,
    };

    return value;
  }
}
