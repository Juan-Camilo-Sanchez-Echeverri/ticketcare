import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { CurrentUser, Roles } from '@common/decorators';

import { PaginationTicketDto } from '../dto';
import { TicketsService } from '../tickets.service';
import { TicketResponseInterceptor } from '../interceptors';
import { FilterTicketsUnassignedPipe } from '../pipes';

@Controller('tickets')
@UseInterceptors(TicketResponseInterceptor)
export class TicketsListController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get('unassigned-tickets/:contractorId')
  @Roles('Admin', 'Coordinator', 'Agent')
  async findAllByContractorId(
    @Param('contractorId') _contractorId: string,
    @Query(FilterTicketsUnassignedPipe)
    query: PaginationTicketDto,
  ) {
    return await this.ticketsService.findPaginate(query);
  }

  @Post('assigned-tickets/:contractorId')
  @Roles('Agent')
  @HttpCode(HttpStatus.OK)
  async getMeTicketsAssigned(
    @Param('contractorId') _contractorId: string,
    @Body() body: PaginationTicketDto,
    @CurrentUser('_id') userId: string,
  ) {
    body.data = { ...body.data, assignedUser: userId };
    return await this.ticketsService.findPaginate(body);
  }

  @Post('filter/:contractorId')
  @Roles('SuperUser', 'Admin', 'Coordinator')
  @HttpCode(HttpStatus.OK)
  async findAllByContractorIdAndUserId(
    @Param('contractorId') _contractorId: string,
    @Body()
    body: PaginationTicketDto,
  ) {
    return await this.ticketsService.findPaginate(body);
  }

  @Post('my-tickets/:contractorId')
  @Roles('Client')
  @HttpCode(HttpStatus.OK)
  async getMyTickets(
    @Param('contractorId') _contractorId: string,
    @Body() body: PaginationTicketDto,
    @CurrentUser('_id') userId: string,
  ) {
    body.data = { ...body.data, requestingUser: userId };

    return await this.ticketsService.findPaginate(body);
  }
}
