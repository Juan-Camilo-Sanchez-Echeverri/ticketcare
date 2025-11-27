import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import type { PaginateModel, PipelineStage } from 'mongoose';

import { EntityRepository } from '@common/database';

import { Ticket, TicketDocument } from '@modules/tickets/schemas';

@Injectable()
export class MetricsRepository extends EntityRepository<TicketDocument> {
  constructor(
    @InjectModel(Ticket.name)
    protected readonly ticketModel: PaginateModel<TicketDocument>,
  ) {
    super(ticketModel);
  }

  async aggregate<T = unknown>(pipeline: PipelineStage[]): Promise<T[]> {
    return this.ticketModel.aggregate<T>(pipeline).exec();
  }
}
