import type { Request } from 'express';

import { REQUEST } from '@nestjs/core';

import { Inject, Injectable, PipeTransform } from '@nestjs/common';

import { EvidenceDto } from '../dto';

import { TicketsService } from '../tickets.service';

@Injectable()
export class EvidenceTicketPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly ticketsService: TicketsService,
  ) {}
  async transform(value: EvidenceDto) {
    const ticketId = this.request.params.ticketId;

    const ticket = await this.ticketsService.findOneById(ticketId);

    value = {
      ...value,
      contractorId: String(ticket.businessContractor._id),
      multimedia: value.multimedia,
      query: {
        $set: {
          'evidence.user': value.user,
          'evidence.password': value.password,
          'evidence.url': value.url,
        },
      },
    };

    return value;
  }
}
