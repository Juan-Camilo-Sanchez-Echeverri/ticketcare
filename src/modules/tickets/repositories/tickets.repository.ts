import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import type { PaginateModel } from 'mongoose';

import { EntityRepository } from '@common/database';

import { Ticket, TicketDocument } from '../schemas';

@Injectable()
export class TicketsRepository extends EntityRepository<TicketDocument> {
  constructor(
    @InjectModel(Ticket.name)
    readonly ticketModel: PaginateModel<TicketDocument>,
  ) {
    super(ticketModel);
  }
}
