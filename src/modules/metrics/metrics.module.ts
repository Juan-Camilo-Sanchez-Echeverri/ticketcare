import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Ticket, TicketSchema } from '@modules/tickets/schemas';

import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { MetricsRepository } from './repositories';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
  ],
  controllers: [MetricsController],
  providers: [MetricsService, MetricsRepository],
  exports: [MetricsService],
})
export class MetricsModule {}
