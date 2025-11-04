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

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  AllRoles,
  ApiAuthResponses,
  ApiCreatedResponseWrapper,
  ApiOkResponseWrapper,
  Roles,
} from '@common/decorators';

import { OwnTicketGuard } from '../guards';

import {
  TransferDepartmentPipe,
  ValidationTicketPipe,
  AssignedTicketPipe,
  TransferLevelPipe,
} from '../pipes';

import {
  CreateTicketDto,
  TransferDepartmentDto,
  TransferLevelDto,
  UpdateTicketDto,
  AssignedTicketDto,
} from '../dto';

import { TicketDocument } from '../schemas';

import { TicketsService } from '../tickets.service';

import {
  TicketCreationEventInterceptor,
  TicketStatusEventInterceptor,
} from '../interceptors';
import { TicketResponse } from '../responses/ticket.response';

@ApiBearerAuth()
@ApiAuthResponses()
@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  /**
   * Get a ticket by its id.
   *
   * @remarks
   *
   * Retrieves a ticket using its unique identifier.
   *
   * Allows <b>all roles</b> to access this endpoint.
   */
  @Get(':ticketId')
  @AllRoles()
  @UseGuards(OwnTicketGuard)
  @ApiOkResponseWrapper(TicketResponse, { isArray: false })
  async findOneById(
    @Param('ticketId') ticketId: string,
  ): Promise<TicketDocument> {
    return await this.ticketsService.findOneById(ticketId);
  }

  /**
   * Create a new ticket.
   *
   * @remarks
   *
   * Creates a new ticket with the provided details.
   *
   * Allows <b>all roles</b> to access this endpoint.
   */
  @Post()
  @AllRoles()
  @ApiCreatedResponseWrapper(TicketResponse)
  @UseInterceptors(TicketCreationEventInterceptor)
  async create(
    @Body(ValidationTicketPipe) createTicketDto: CreateTicketDto,
  ): Promise<TicketDocument> {
    return await this.ticketsService.create(createTicketDto);
  }

  /**
   * Update a ticket by its id.
   *
   * @remarks
   * Updates the details of an existing ticket using its unique identifier.
   *
   * Allows only users with roles <b>Admin</b>, <b>Coordinator</b>, and <b>Agent</b> to access this endpoint.
   *
   */
  @Patch(':ticketId')
  @Roles('Admin', 'Coordinator', 'Agent')
  @UseGuards(OwnTicketGuard)
  @UseInterceptors(TicketStatusEventInterceptor)
  @ApiOkResponseWrapper(TicketResponse, { isArray: false })
  async update(
    @Param('ticketId') ticketId: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ): Promise<TicketDocument> {
    return await this.ticketsService.update(ticketId, updateTicketDto);
  }

  /**
   * Assign a ticket to an agent.
   *
   * @remarks
   *
   * Assigns a ticket to a specific agent.
   *
   * Allows only users with roles <b>Admin</b>, <b>Coordinator</b>, and <b>Agent</b> to access this endpoint.
   */
  @Patch('assign/:ticketId')
  @Roles('Admin', 'Coordinator', 'Agent')
  @UseGuards(OwnTicketGuard)
  @UseInterceptors(TicketStatusEventInterceptor)
  @ApiOkResponseWrapper(TicketResponse, { isArray: false })
  async assignTicket(
    @Param('ticketId') ticketId: string,
    @Body(AssignedTicketPipe) assignedTicketDto: AssignedTicketDto,
  ): Promise<TicketDocument> {
    return await this.ticketsService.assignTicket(ticketId, assignedTicketDto);
  }

  /**
   * Transfer a ticket to a different department.
   *
   * @remarks
   *
   * Transfers a ticket to another department within the organization.
   *
   * Allows only users with roles <b>Admin</b>, <b>Coordinator</b>, and <b>Agent</b> to access this endpoint.
   */
  @Patch('transfer-department/:ticketId')
  @Roles('Admin', 'Coordinator', 'Agent')
  @UseGuards(OwnTicketGuard)
  @UseInterceptors(TicketStatusEventInterceptor)
  @ApiOkResponseWrapper(TicketResponse, { isArray: false })
  async transferDepartment(
    @Param('ticketId') ticketId: string,
    @Body(TransferDepartmentPipe) transferDto: TransferDepartmentDto,
  ): Promise<TicketDocument> {
    return await this.ticketsService.transferDepartment(ticketId, transferDto);
  }

  /**
   * Transfer a ticket to a different support level.
   *
   * @remarks
   *
   * Transfers a ticket to another support level within the organization.
   *
   * Allows only users with roles <b>Admin</b>, <b>Coordinator</b>, and <b>Agent</b> to access this endpoint.
   */
  @Patch('transfer-level/:ticketId')
  @Roles('Admin', 'Coordinator', 'Agent')
  @UseGuards(OwnTicketGuard)
  @UseInterceptors(TicketStatusEventInterceptor)
  @ApiOkResponseWrapper(TicketResponse, { isArray: false })
  async transferLevel(
    @Param('ticketId') ticketId: string,
    @Body(TransferLevelPipe) transferDto: TransferLevelDto,
  ): Promise<TicketDocument> {
    return await this.ticketsService.transferLevel(ticketId, transferDto);
  }
}
