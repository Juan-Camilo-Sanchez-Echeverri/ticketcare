import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BusinessClientsModule } from '@modules/business-clients/business-clients.module';
import { BusinessContractorsModule } from '@modules/business-contractors/business-contractors.module';
import { SupportDepartmentsModule } from '@modules/support-departments/support-departments.module';
import { SupportLevelsModule } from '@modules/support-levels/support-levels.module';

import { Ticket, TicketSchema } from './schemas/ticket.schema';
import {
  TicketsController,
  TicketsFilesController,
  TicketsListController,
} from './controllers';
import { TicketsService } from './tickets.service';
import { UsersModule } from '../users/users.module';
import { TicketsRepository } from './repositories/tickets.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Ticket.name,
        schema: TicketSchema,
      },
    ]),
    BusinessClientsModule,
    BusinessContractorsModule,
    SupportDepartmentsModule,
    SupportLevelsModule,
    UsersModule,
  ],
  controllers: [
    TicketsListController,
    TicketsController,
    TicketsFilesController,
  ],
  providers: [TicketsService, TicketsRepository],
  exports: [TicketsService],
})
export class TicketsModule {}
