import type { Request } from 'express';

import { REQUEST } from '@nestjs/core';

import {
  ForbiddenException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

import { extractUserFromRequest } from '@common/helpers';

import { UserRole } from '@common/enums';

import { UserDocument } from '@modules/users/schemas';
import { UsersService } from '@modules/users/users.service';

import { AssignedTicketDto } from '../dto';

import { TicketsService } from '../tickets.service';

import { TicketDocument } from '../schemas';

import { TicketErrors } from '../errors/tickets.errors';

@Injectable()
export class AssignedTicketPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly ticketsService: TicketsService,
    private readonly usersService: UsersService,
  ) {}

  async transform(value: AssignedTicketDto): Promise<AssignedTicketDto> {
    const { assignedUser } = value;
    const ticketId = this.request.params.ticketId;

    const requestingUser = extractUserFromRequest(this.request);

    const assignedUserInfo = await this.usersService.findOneById(assignedUser);

    const ticket = await this.ticketsService.findOneById(ticketId);

    if (requestingUser.role !== UserRole.SuperUser) {
      this.validateUsers(requestingUser, assignedUserInfo, ticket);
    }

    value.requestingUser = requestingUser;
    value.assignedUserInfo = assignedUserInfo;

    return value;
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
    const assignedContractors = new Set(
      assignedUser.details.businessContractors.map((bc) => String(bc._id)),
    );

    const authorized = reqContractors.some((bc) => assignedContractors.has(bc));

    if (!authorized) throw new ForbiddenException();
  }

  private validateDeptAndLevel(
    assignedUser: UserDocument,
    ticket: TicketDocument,
  ): void {
    const departments = assignedUser.details.supportDepartments;
    const levels = assignedUser.details.supportLevels;
    const department = String(ticket?.supportDepartment?._id ?? '');
    const levelTicket = String(ticket?.supportLevel?._id ?? '');

    const departmentValid = departments.some(
      ({ _id }) => String(_id) === department,
    );

    const isLevelValid = levels.some(({ _id }) => String(_id) === levelTicket);

    if (!departmentValid) {
      throw new ForbiddenException(TicketErrors.DEPARTMENT_MISMATCH);
    }

    if (!isLevelValid) {
      throw new ForbiddenException(TicketErrors.LEVEL_MISMATCH);
    }
  }
}
