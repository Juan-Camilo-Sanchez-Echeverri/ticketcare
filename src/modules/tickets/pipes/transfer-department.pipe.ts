import type { Request } from 'express';

import { REQUEST } from '@nestjs/core';

import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

import { UserRole } from '@common/enums';
import { extractUserFromRequest } from '@common/helpers';

import { SupportDepartmentDocument } from '@modules/support-departments/schemas/support-department.schema';
import { SupportDepartmentsService } from '@modules/support-departments/support-departments.service';
import { UserDocument } from '@modules/users/schemas';

import { TicketErrors } from '../errors/tickets.errors';

import { TransferDepartmentDto } from '../dto';

import { TicketsService } from '../tickets.service';

import { TicketDocument } from '../schemas';

@Injectable()
export class TransferDepartmentPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly ticketsService: TicketsService,
    private readonly departmentsService: SupportDepartmentsService,
  ) {}

  async transform(value: TransferDepartmentDto) {
    const { supportDepartment } = value;
    const ticketId = this.request.params.ticketId;

    const ticket = await this.ticketsService.findOneById(ticketId);

    const departmentInfo =
      await this.departmentsService.findOneById(supportDepartment);

    if (String(ticket?.supportDepartment?._id) === supportDepartment) {
      throw new BadRequestException(TicketErrors.TICKET_ALREADY_IN_DEPARTMENT);
    }

    const user = extractUserFromRequest(this.request);

    this.checkDepartmentTransferPermission(ticket, departmentInfo);

    if (user.role === UserRole.Agent) {
      this.handleAgentTransfer(ticket, user, value, departmentInfo);
    } else {
      value.unsetAssignedUser = true;
      value.requestingUser = user;
      value.departmentInfo = departmentInfo;
      value.ticket = ticket;
    }

    return value;
  }

  private handleAgentTransfer(
    ticket: TicketDocument,
    user: UserDocument,
    value: TransferDepartmentDto,
    departmentInfo: SupportDepartmentDocument,
  ) {
    const isDepartment = user.details.supportDepartments.some(
      (department) => String(department._id) === value.supportDepartment,
    );
    const isMeTicket = String(ticket?.assignedUser?._id) === String(user._id);

    if (isDepartment && isMeTicket) {
      value.unsetAssignedUser = false;
    } else {
      value.unsetAssignedUser = true;
    }

    value.requestingUser = user;
    value.departmentInfo = departmentInfo;
    value.ticket = ticket;
  }

  private checkDepartmentTransferPermission(
    ticket: TicketDocument,
    departmentInfo: SupportDepartmentDocument,
  ) {
    if (
      String(ticket?.businessContractor?._id) !==
      String(departmentInfo.businessContractor._id)
    ) {
      throw new ForbiddenException(
        TicketErrors.NO_PERMISSION_TRANSFER_DEPARTMENT,
      );
    }
  }
}
