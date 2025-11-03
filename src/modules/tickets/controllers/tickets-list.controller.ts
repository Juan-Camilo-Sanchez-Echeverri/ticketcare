import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';

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

import { TicketResponseInterceptor } from '../interceptors';
import { TicketResponse } from '../responses/ticket.response';

@ApiBearerAuth()
@ApiAuthResponses()
@ApiTags('tickets')
@Controller('tickets')
@UseInterceptors(TicketResponseInterceptor)
export class TicketsListController {
  constructor(private readonly ticketsService: TicketsService) {}

  /**
   *
   * Get all unassigned tickets for a specific contractor.
   *
   * @remarks
   *
   * Retrieves a paginated list of unassigned tickets associated with the given contractor ID.
   *
   * Allows only users with roles <b>Admin</b>, <b>Coordinator</b>, and <b>Agent</b> to access this endpoint.
   */
  @Get('unassigned-tickets/:contractorId')
  @Roles('Admin', 'Coordinator', 'Agent')
  @ApiOkResponseWrapper(TicketResponse, { isArray: true })
  async findAllByContractorId(
    @Param('contractorId') _contractorId: string,
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
  @Get('assigned-tickets/:contractorId')
  @Roles('Agent')
  @ApiOkResponseWrapper(TicketResponse, { isArray: true })
  async getMeTicketsAssigned(
    @Param('contractorId') _contractorId: string,
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
  @Get('my-tickets/:contractorId')
  @Roles('Client')
  @ApiOkResponseWrapper(TicketResponse, { isArray: true })
  async getMyTickets(
    @Param('contractorId') _contractorId: string,
    @Query() query: FilterTicketDto,
    @CurrentUser('_id') userId: string,
  ) {
    query.data = { ...query.data, requestingUser: userId };

    return await this.ticketsService.findPaginate(query);
  }
}
