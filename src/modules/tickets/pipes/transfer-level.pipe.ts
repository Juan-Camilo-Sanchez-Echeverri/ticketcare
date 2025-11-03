import type { Request } from 'express';

import { REQUEST } from '@nestjs/core';

import {
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

import { UserRole } from '@common/enums';
import { extractUserFromRequest } from '@common/helpers';

import { SupportLevelsService } from '@modules/support-levels/support-levels.service';
import { SupportLevelDocument } from '@modules/support-levels/schemas/support-level.schema';
import { UserDocument } from '@modules/users/schemas';

import { TransferLevelDto } from '../dto';

import { TicketErrors } from '../errors/tickets.errors';

import { TicketsService } from '../tickets.service';

import { TicketDocument } from '../schemas';

@Injectable()
export class TransferLevelPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly ticketsService: TicketsService,
    private readonly levelsService: SupportLevelsService,
  ) {}

  async transform(value: TransferLevelDto) {
    const { supportLevel } = value;
    const ticketId = this.request.params.ticketId;

    const ticket = await this.ticketsService.findOneById(ticketId);
    const levelInfo = await this.levelsService.findOneById(supportLevel);

    if (String(ticket.supportLevel._id) === supportLevel) {
      throw new BadRequestException(TicketErrors.TICKET_ALREADY_IN_LEVEL);
    }

    const user = extractUserFromRequest(this.request);

    this.checkLevelTransferPermission(ticket, levelInfo);

    if (user.role === UserRole.Agent) {
      this.handleAgentTransfer(value, levelInfo, user, ticket);
    } else {
      value.unsetAssignedUser = true;
      value.levelInfo = levelInfo;
      value.ticket = ticket;
    }

    return value;
  }

  private handleAgentTransfer(
    value: TransferLevelDto,
    levelInfo: SupportLevelDocument,
    user: UserDocument,
    ticket: TicketDocument,
  ) {
    const { supportLevel } = value;

    const isLevel = user.details.supportLevels.some(
      (level) => String(level._id) === supportLevel,
    );

    const isMeTicket = ticket?.assignedUser?._id === user._id;

    if (isLevel && isMeTicket) {
      value.unsetAssignedUser = false;
    } else {
      value.unsetAssignedUser = true;
    }

    value.levelInfo = levelInfo;
    value.ticket = ticket;
  }

  private checkLevelTransferPermission(
    ticket: TicketDocument,
    levelInfo: SupportLevelDocument,
  ) {
    if (ticket.businessContractor._id !== levelInfo.businessContractor._id) {
      throw new BadRequestException(TicketErrors.NO_PERMISSION_TRANSFER_LEVEL);
    }

    const departmentTicket = ticket.supportDepartment;

    const isDepartment = departmentTicket.supportLevels.some(
      (level) => String(level._id) === String(levelInfo._id),
    );

    if (!isDepartment) {
      throw new BadRequestException(TicketErrors.LEVEL_NOT_BELONG);
    }
  }
}
