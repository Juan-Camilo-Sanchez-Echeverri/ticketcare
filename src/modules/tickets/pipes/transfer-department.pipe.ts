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

import { UpdateTicketDto } from '../dto';

import { StatusTicket, TypeContent } from '../enums';

import { messageTransferDepartment } from '../helpers';

import { TicketsService } from '../tickets.service';

import { TicketDocument } from '../schemas';

@Injectable()
export class TransferDepartmentPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly ticketsService: TicketsService,
    private readonly departmentsService: SupportDepartmentsService,
  ) {}

  async transform(value: UpdateTicketDto) {
    const { supportDepartment } = value;
    const ticketId = this.request.params.ticketId;

    const ticket = await this.ticketsService.findOneById(ticketId);

    const departmentInfo = await this.departmentsService.findOneById(
      supportDepartment!,
    );

    if (String(ticket.supportDepartment._id) === supportDepartment) {
      throw new BadRequestException(TicketErrors.TICKET_ALREADY_IN_DEPARTMENT);
    }

    const user = extractUserFromRequest(this.request);

    this.checkDepartmentTransferPermission(ticket, departmentInfo);

    if (user.role === UserRole.Agent) {
      this.handleAgentTransfer(ticket, user, value, departmentInfo);
    } else {
      this.setDefaultTransferQuery(value, user, ticket, departmentInfo);
    }

    return value;
  }

  private handleAgentTransfer(
    ticket: TicketDocument,
    user: UserDocument,
    value: UpdateTicketDto,
    departmentInfo: SupportDepartmentDocument,
  ) {
    const isDepartment = user.details.supportDepartments.some(
      (department) => String(department._id) === value.supportDepartment,
    );
    const isMeTicket = ticket?.assignedUser?._id === user._id;

    if (isDepartment && isMeTicket) {
      this.setTransferQuery(value, departmentInfo, user, ticket);
    } else {
      this.setDefaultTransferQuery(value, user, ticket, departmentInfo);
    }
  }

  private setTransferQuery(
    value: UpdateTicketDto,
    departmentInfo: SupportDepartmentDocument,
    user: UserDocument,
    ticket: TicketDocument,
  ) {
    value.query = {
      $set: {
        ...value,
        supportLevel: departmentInfo.defaultLevel,
        status: StatusTicket.CHANGE_DEPARTMENT,
      },
      $push: {
        activity: {
          content: {
            type: TypeContent.TRANSFER_DEPARTMENT,
            message: messageTransferDepartment(user, ticket, departmentInfo),
          },
        },
      },
    };
  }

  private setDefaultTransferQuery(
    value: UpdateTicketDto,
    user: UserDocument,
    ticket: TicketDocument,
    departmentInfo: SupportDepartmentDocument,
  ) {
    value.query = {
      $set: {
        ...value,
        supportLevel: departmentInfo.defaultLevel._id,
        status: StatusTicket.CHANGE_DEPARTMENT,
      },
      $unset: { assignedUser: '' },
      $push: {
        activity: {
          content: {
            type: TypeContent.TRANSFER_DEPARTMENT,
            message: messageTransferDepartment(user, ticket, departmentInfo),
          },
        },
      },
    };
  }

  private checkDepartmentTransferPermission(
    ticket: TicketDocument,
    departmentInfo: SupportDepartmentDocument,
  ) {
    if (
      ticket.businessContractor._id !== departmentInfo.businessContractor._id
    ) {
      throw new ForbiddenException(
        TicketErrors.NO_PERMISSION_TRANSFER_DEPARTMENT,
      );
    }
  }
}
