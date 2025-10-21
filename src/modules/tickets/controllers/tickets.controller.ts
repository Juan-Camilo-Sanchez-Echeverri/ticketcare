import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
  UseInterceptors,
} from '@nestjs/common';

import { AllRoles, Roles } from '@common/decorators';

import {} from '@common/enums';

import { OwnTicketGuard } from '../guards';
import {
  TransferDepartmentPipe,
  ValidationTicketPipe,
  AssignedTicketPipe,
  TransferLevelPipe,
} from '../pipes';

import { AssignedTicketDto, CreateTicketDto, UpdateTicketDto } from '../dto';

import { TicketsService } from '../tickets.service';
import { TicketDocument } from '../schemas';
import {
  TicketCreationEventInterceptor,
  TicketResponseInterceptor,
  TicketStatusEventInterceptor,
} from '../interceptors';

@Controller('tickets')
@UseInterceptors(TicketResponseInterceptor)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get(':ticketId')
  @AllRoles()
  @UseGuards(OwnTicketGuard)
  async findOneById(
    @Param('ticketId') ticketId: string,
  ): Promise<TicketDocument> {
    return await this.ticketsService.findOneById(ticketId);
  }

  @Post(':contractorId')
  @AllRoles()
  @UseInterceptors(TicketCreationEventInterceptor)
  async create(
    @Body(ValidationTicketPipe) createTicketDto: CreateTicketDto,
  ): Promise<TicketDocument> {
    return await this.ticketsService.create(createTicketDto);
  }

  @Patch(':ticketId')
  @Roles('Admin', 'Coordinator', 'Agent')
  @UseGuards(OwnTicketGuard)
  @UseInterceptors(TicketStatusEventInterceptor)
  async update(
    @Param('ticketId') ticketId: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ): Promise<TicketDocument> {
    return await this.ticketsService.update(ticketId, {
      query: updateTicketDto,
    });
  }

  @Patch('assign/:ticketId')
  @Roles('Admin', 'Coordinator', 'Agent')
  @UseGuards(OwnTicketGuard)
  @UseInterceptors(TicketStatusEventInterceptor)
  async assignTicket(
    @Param('ticketId') ticketId: string,
    @Body(AssignedTicketPipe)
    assignedTicketDto: AssignedTicketDto,
  ): Promise<TicketDocument> {
    return await this.ticketsService.update(ticketId, assignedTicketDto);
  }

  @Patch('transfer-department/:ticketId')
  @Roles('Admin', 'Coordinator', 'Agent')
  @UseGuards(OwnTicketGuard)
  @UseInterceptors(TicketStatusEventInterceptor)
  async transferDepartment(
    @Param('ticketId') ticketId: string,
    @Body(TransferDepartmentPipe) updateTicketDto: UpdateTicketDto,
  ): Promise<TicketDocument> {
    return await this.ticketsService.update(ticketId, updateTicketDto);
  }

  @Patch('transfer-level/:ticketId')
  @Roles('Admin', 'Coordinator', 'Agent')
  @UseGuards(OwnTicketGuard)
  @UseInterceptors(TicketStatusEventInterceptor)
  async transferLevel(
    @Param('ticketId') ticketId: string,
    @Body(TransferLevelPipe) updateTicketDto: UpdateTicketDto,
  ): Promise<TicketDocument> {
    return await this.ticketsService.update(ticketId, updateTicketDto);
  }
}
