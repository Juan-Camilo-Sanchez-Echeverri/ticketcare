import type { Request } from 'express';

import { REQUEST } from '@nestjs/core';

import {
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

import { extractUserFromRequest } from '@common/helpers';

import { UserDocument } from '@modules/users/schemas/user.schema';

import { ActivityDto } from '../dto';

import { TypeContent, StatusTicket } from '../enums';

import { TicketsService } from '../tickets.service';

import { TicketDocument } from '../schemas/ticket.schema';

@Injectable()
export class ActivityTicketPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly ticketsService: TicketsService,
  ) {}

  async transform(value: ActivityDto): Promise<ActivityDto> {
    const ticketId = this.request.params.ticketId;
    const user = extractUserFromRequest(this.request);

    const ticket = await this.ticketsService.findOneById(ticketId);

    const files = this.request.files as Express.Multer.File[];

    if (!value?.content?.message) {
      throw new BadRequestException('content.message is required');
    }

    value = {
      ...value,
      contractorId: String(ticket?.businessContractor?._id),
      status: this.updateStatusTicket(ticket, user),
      user: String(user._id),
      content: {
        ...value.content,
        message: value.content.message,
        type: this.getType(files, value),
      },
    };

    return value;
  }

  private updateStatusTicket(ticket: TicketDocument, user: UserDocument) {
    let status: StatusTicket = ticket.status;

    const isMeRequestTicket = ticket.requestingUser._id === user.id;

    if (isMeRequestTicket) status = StatusTicket.CLIENT_RESPONSE;

    const isTicketAssigned = ticket.assignedUser?._id === user._id;

    if (isTicketAssigned) status = StatusTicket.PENDING_RESPONSE;

    return status;
  }

  private getType(
    files: Express.Multer.File[],
    value: ActivityDto,
  ): TypeContent {
    if (value?.content?.urls) return TypeContent.MULTIMEDIA;

    return files?.length ? TypeContent.MULTIMEDIA : TypeContent.TEXT;
  }
}
