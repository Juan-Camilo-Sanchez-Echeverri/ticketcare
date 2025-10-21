import type { Request } from 'express';

import { REQUEST } from '@nestjs/core';

import {
  Injectable,
  PipeTransform,
  Inject,
  BadRequestException,
} from '@nestjs/common';

import { Types } from 'mongoose';

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
    const { supportDepartment } = value;

    const contractorId = this.request.params.contractorId;
    const requestingUser = extractUserFromRequest(this.request);

    const department = await this.departmentsService.findOneByQuery({
      _id: supportDepartment,
      businessContractor: new Types.ObjectId(contractorId),
    });

    if (!department) {
      throw new BadRequestException('Department not found for this contractor');
    }

    const supportLevel = String(department.defaultLevel._id);

    value = {
      ...value,
      requestingUser: String(requestingUser._id),
      requestingUserInfo: requestingUser,
      businessContractor: contractorId,
      supportLevel,
    };

    return value;
  }
}
