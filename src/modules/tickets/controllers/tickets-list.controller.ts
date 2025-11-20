import { Controller, Get, Query } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  ApiAuthResponses,
  ApiOkResponseWrapper,
  CurrentUser,
  Roles,
} from '@common/decorators';

import { FilterTicketDto } from '../dto';

import { FilterTicketsUnassignedPipe } from '../pipes';

import { TicketsService } from '../tickets.service';

import { TicketResponse } from '../responses/ticket.response';

@ApiBearerAuth()
@ApiAuthResponses()
@ApiTags('tickets')
@Controller('tickets')
export class TicketsListController {
  constructor(private readonly ticketsService: TicketsService) {}

  /**
   *
   * Get all unassigned tickets
   *
   * @remarks
   *
   * Retrieves a paginated list of unassigned tickets associated.
   *
   * Allows only users with roles <b>Admin</b>, <b>Coordinator</b>, and <b>Agent</b> to access this endpoint.
   */
  @Get('unassigned-tickets')
  @Roles('Admin', 'Coordinator', 'Agent')
  @ApiOkResponseWrapper(TicketResponse, { isArray: true })
  async findAllByContractorId(
    @Query(FilterTicketsUnassignedPipe)
    query: FilterTicketDto,
  ) {
    return await this.ticketsService.findPaginate(query);
  }

  /**
   *
   * Get all tickets assigned to the current agent.
   *
   * @remarks
   *
   * Retrieves a paginated list of tickets assigned to the currently authenticated agent.
   *
   * Allows only users with the role <b>Agent</b> to access this endpoint.
   */
  @Get('assigned-tickets')
  @Roles('Agent')
  @ApiOkResponseWrapper(TicketResponse, { isArray: true })
  async getMeTicketsAssigned(
    @Query() query: FilterTicketDto,
    @CurrentUser('_id') userId: string,
  ) {
    query.data = { ...query.data, assignedUser: userId };
    return await this.ticketsService.findPaginate(query);
  }

  /**
   *
   * Get all tickets created by the current client user.
   *
   *  @remarks
   *
   * Retrieves a paginated list of tickets created by the currently authenticated client user.
   *
   * Allows only users with the role <b>Client</b> to access this endpoint.
   */
  @Get('my-tickets')
  @Roles('Client')
  @ApiOkResponseWrapper(TicketResponse, { isArray: true })
  async getMyTickets(
    @Query() query: FilterTicketDto,
    @CurrentUser('_id') userId: string,
  ) {
    query.data = { ...query.data, requestingUser: userId };

    return await this.ticketsService.findPaginate(query);
  }
}
