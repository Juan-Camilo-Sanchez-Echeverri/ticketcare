import type { Request } from 'express';

import { REQUEST } from '@nestjs/core';

import {
  ForbiddenException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

import { extractUserFromRequest } from '@common/helpers';

import { UserDocument } from '@modules/users/schemas';
import { UsersService } from '@modules/users/users.service';

import { AssignedTicketDto } from '../dto';
import { StatusTicket, TypeContent } from '../enums';
import { TicketsService } from '../tickets.service';

import { messageAssignTicket, messageTransferAgent } from '../helpers';
import { TicketDocument } from '../schemas';
import { DEPARTMENT_MISMATCH, LEVEL_MISMATCH } from '../constants';

@Injectable()
export class AssignedTicketPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly ticketsService: TicketsService,
    private readonly usersService: UsersService,
  ) {}

  async transform(value: AssignedTicketDto) {
    const { assignedUser } = value;
    const ticketId = this.request.params.ticketId;

    const requestingUser = extractUserFromRequest(this.request);
    const assignedUserInfo = await this.usersService.findOneById(assignedUser!);

    const ticket = await this.ticketsService.findOneById(ticketId);

    this.validateUsers(requestingUser, assignedUserInfo, ticket);

    const { status, type, message } = this.getTicketUpdateData(
      requestingUser,
      assignedUserInfo,
      ticket,
    );

    value.query = {
      $set: { ...value, status },
      $push: {
        activity: {
          content: { type, message },
          user: requestingUser._id,
        },
      },
    };

    delete value.assignedUser;

    return value;
  }

  private getTicketUpdateData(
    requestingUser: UserDocument,
    assignedUser: UserDocument,
    ticket: TicketDocument,
  ) {
    const isReassigned = !!ticket.assignedUser?._id;

    const status = isReassigned
      ? StatusTicket.CHANGE_AGENT
      : StatusTicket.ASSIGNED;

    const type = isReassigned ? TypeContent.TRANSFER_AGENT : TypeContent.ASSIGN;

    const message = isReassigned
      ? messageTransferAgent(requestingUser, assignedUser, ticket)
      : messageAssignTicket(requestingUser, ticket);

    return { status, type, message };
  }

  private validateUsers(
    requestingUser: UserDocument,
    assignedUser: UserDocument,
    ticket: TicketDocument,
  ): void {
    this.validateContractors(requestingUser, assignedUser);
    this.validateDeptAndLevel(assignedUser, ticket);
  }

  private validateContractors(
    requestingUser: UserDocument,
    assignedUser: UserDocument,
  ): void {
    const reqContractors = requestingUser.details.businessContractors.map(
      (bc) => String(bc._id),
    );
    const assignedContractors = assignedUser.details.businessContractors.map(
      (bc) => String(bc._id),
    );

    const authorized = reqContractors.some((bc) =>
      assignedContractors.includes(bc),
    );

    if (!authorized) throw new ForbiddenException();
  }

  private validateDeptAndLevel(
    assignedUser: UserDocument,
    ticket: TicketDocument,
  ): void {
    const departments = assignedUser.details.supportDepartments;
    const levels = assignedUser.details.supportLevels;
    const department = String(ticket.supportDepartment._id);
    const levelTicket = String(ticket.supportLevel._id);

    const departmentValid = departments.some(
      ({ _id }) => String(_id) === department,
    );

    const isLevelValid = levels.some(({ _id }) => String(_id) === levelTicket);

    if (!departmentValid) throw new ForbiddenException(DEPARTMENT_MISMATCH);
    if (!isLevelValid) throw new ForbiddenException(LEVEL_MISMATCH);
  }
}
