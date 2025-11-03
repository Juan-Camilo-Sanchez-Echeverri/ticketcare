import { Injectable, NotFoundException } from '@nestjs/common';

import { EventEmitter2 } from '@nestjs/event-emitter';

import { Cron, CronExpression } from '@nestjs/schedule';

import { PopulateOptions, UpdateQuery } from 'mongoose';

import { Status, TicketEvents } from '@common/enums';

import {
  ActivityDto,
  AssignedTicketDto,
  CreateTicketDto,
  EvidenceDto,
  FilterTicketDto,
  TransferDepartmentDto,
  TransferLevelDto,
  UpdateTicketDto,
} from './dto';

import {
  getTicketSerial,
  messageAssignTicket,
  messageTransferAgent,
  messageTransferDepartment,
  validateHourDifference,
} from './helpers';

import { TicketsRepository } from './repositories/tickets.repository';

import { Activity, TicketDocument } from './schemas';

import { TicketErrors } from './errors/tickets.errors';

import { StatusTicket, TypeContent } from './enums';

@Injectable()
export class TicketsService {
  private readonly match = { status: Status.ACTIVE };
  private readonly pathsPopulate: PopulateOptions[] = [
    {
      path: 'assignedUser',
      select: 'name lastName phone email',
      match: this.match,
    },
    {
      path: 'requestingUser',
      select: 'name lastName phone email',
      match: this.match,
    },
    { path: 'supportDepartment', match: this.match },
    { path: 'businessClient', select: 'name', match: this.match },
    { path: 'supportLevel', select: 'name', match: this.match },
    { path: 'businessContractor', select: 'name', match: this.match },
    {
      path: 'activity.user',
      select: 'name lastName phone email',
      match: this.match,
    },
  ];

  constructor(
    private readonly repository: TicketsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findPaginate(query: FilterTicketDto) {
    return await this.repository.findPaginate(query, {
      populate: this.pathsPopulate,
    });
  }

  async findOneById(id: string): Promise<TicketDocument> {
    const ticket = await this.repository.findOneById(id);

    if (!ticket) throw new NotFoundException(TicketErrors.NOT_FOUND.message);

    return this.populateTicket(ticket);
  }

  async create(createTicketDto: CreateTicketDto): Promise<TicketDocument> {
    const { businessContractor } = createTicketDto;

    const serial = await getTicketSerial(
      this.repository.ticketModel,
      businessContractor,
    );

    const newTicket = await this.repository.create({
      ...createTicketDto,
      serial,
    });

    return await this.populateTicket(newTicket);
  }

  async update(
    id: string,
    updateTicketDto: UpdateTicketDto,
  ): Promise<TicketDocument> {
    const ticketUpdate = await this.repository.findByIdAndUpdate(
      id,
      updateTicketDto,
    );

    if (!ticketUpdate) throw new NotFoundException(TicketErrors.NOT_FOUND);

    return await this.populateTicket(ticketUpdate);
  }

  async addActivity(
    ticketId: string,
    activityDto: ActivityDto,
  ): Promise<TicketDocument> {
    const updateQuery = {
      $push: {
        activity: {
          content: activityDto.content,
          user: activityDto.user,
        },
      },
      $set: { status: activityDto.status },
    };

    const ticketUpdate = await this.repository.findByIdAndUpdate(
      ticketId,
      updateQuery,
    );

    if (!ticketUpdate) throw new NotFoundException(TicketErrors.NOT_FOUND);

    return this.populateTicket(ticketUpdate);
  }

  async addEvidence(
    ticketId: string,
    evidenceDto: EvidenceDto,
  ): Promise<TicketDocument> {
    const updateQuery = {
      $set: {
        'evidence.user': evidenceDto.user,
        'evidence.password': evidenceDto.password,
        'evidence.url': evidenceDto.url,
      },
      $push: {
        'evidence.multimedia': {
          $each: evidenceDto.multimedia,
        },
      },
    };

    const ticketUpdate = await this.repository.findByIdAndUpdate(
      ticketId,
      updateQuery,
    );

    if (!ticketUpdate) throw new NotFoundException(TicketErrors.NOT_FOUND);

    return this.populateTicket(ticketUpdate);
  }

  async transferDepartment(
    ticketId: string,
    transferDto: TransferDepartmentDto,
  ): Promise<TicketDocument> {
    const { departmentInfo, requestingUser, unsetAssignedUser } = transferDto;

    const updateQuery = {
      $set: {
        supportDepartment: departmentInfo._id,
        supportLevel: departmentInfo.defaultLevel._id,
        status: StatusTicket.CHANGE_DEPARTMENT,
      },
      $push: {
        activity: {
          content: {
            type: TypeContent.TRANSFER_DEPARTMENT,
            message: messageTransferDepartment(
              requestingUser,
              transferDto.ticket,
              departmentInfo,
            ),
            user: requestingUser._id,
          },
        },
      },
      ...(unsetAssignedUser ? { $unset: { assignedUser: '' } } : {}),
    };

    const ticketUpdate = await this.repository.findByIdAndUpdate(
      ticketId,
      updateQuery,
    );

    if (!ticketUpdate) throw new NotFoundException(TicketErrors.NOT_FOUND);

    return this.populateTicket(ticketUpdate);
  }

  async transferLevel(
    ticketId: string,
    transferDto: TransferLevelDto,
  ): Promise<TicketDocument> {
    const { levelInfo, unsetAssignedUser } = transferDto;

    const updateQuery = {
      $set: {
        supportLevel: levelInfo._id,
        status: StatusTicket.CHANGE_LEVEL,
      },
      ...(unsetAssignedUser ? { $unset: { assignedUser: '' } } : {}),
    };

    const ticketUpdate = await this.repository.findByIdAndUpdate(
      ticketId,
      updateQuery,
    );

    if (!ticketUpdate)
      throw new NotFoundException(TicketErrors.NOT_FOUND.message);

    return this.populateTicket(ticketUpdate);
  }

  async assignTicket(
    ticketId: string,
    assignedTicketDto: AssignedTicketDto,
  ): Promise<TicketDocument> {
    const { assignedUser, requestingUser, assignedUserInfo } =
      assignedTicketDto;

    const ticket = await this.findOneById(ticketId);

    const isReassigned = !!ticket.assignedUser?._id;

    const status = isReassigned
      ? StatusTicket.CHANGE_AGENT
      : StatusTicket.ASSIGNED;

    const type = isReassigned ? TypeContent.TRANSFER_AGENT : TypeContent.ASSIGN;

    const message = isReassigned
      ? messageTransferAgent(requestingUser, assignedUserInfo, ticket)
      : messageAssignTicket(requestingUser, ticket);

    const updateQuery = {
      $set: {
        assignedUser,
        status,
      },
      $push: {
        activity: {
          content: { type, message },
          user: requestingUser._id,
        },
      },
    };

    const ticketUpdate = await this.repository.findByIdAndUpdate(
      ticketId,
      updateQuery,
    );

    if (!ticketUpdate) throw new NotFoundException(TicketErrors.NOT_FOUND);

    return this.populateTicket(ticketUpdate);
  }

  async getActivityById(
    ticketId: TicketDocument['id'],
    activityId: string,
  ): Promise<TicketDocument['activity'][number]> {
    const ticket = await this.repository.findOne(
      { _id: ticketId, 'activity._id': activityId },
      { 'activity.$': 1 },
    );

    if (!ticket) throw new NotFoundException(TicketErrors.ACTIVITY_NOT_FOUND);

    return ticket.activity[0];
  }

  async updateActivity(
    ticketId: TicketDocument['id'],
    activityId: string,
    updateQuery: UpdateQuery<unknown>,
  ): Promise<TicketDocument> {
    const updatedTicket = await this.repository.findOneAndUpdate(
      { _id: ticketId, 'activity._id': activityId },
      updateQuery,
      { new: true },
    );

    if (!updatedTicket) throw new NotFoundException(TicketErrors.NOT_FOUND);

    return this.populateTicket(updatedTicket);
  }

  async deleteActivity(ticketId: TicketDocument['id'], activityId: string) {
    const activity = await this.getActivityById(ticketId, activityId);

    await this.repository.findOneAndUpdate(
      { _id: ticketId },
      {
        $pull: { activity: { _id: activityId } },
      },
    );

    return activity;
  }

  async checkAndUpdateActivity(
    ticketId: TicketDocument['id'],
    activityId: string,
  ): Promise<Activity> {
    const activity = await this.getActivityById(ticketId, activityId);

    if (activity['_id'].toString() === activityId) {
      const createdAt = new Date(activity['createdAt']);
      validateHourDifference(createdAt);
    }

    return activity;
  }

  private populateTicket(ticket: TicketDocument): Promise<TicketDocument> {
    return ticket.populate(this.pathsPopulate);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateResolvedTicketsToClosed(): Promise<void> {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const tickets = await this.repository.find(
      {
        status: StatusTicket.RESOLVED,
      },
      {},
      { populate: this.pathsPopulate },
    );

    for (const ticket of tickets) {
      const lastActivity = ticket.activity[ticket.activity.length - 1];

      const dateLastActivity = new Date(lastActivity['updatedAt']);

      if (lastActivity && dateLastActivity <= oneMonthAgo) {
        ticket.status = StatusTicket.CLOSED;
        await this.eventEmitter.emitAsync(TicketEvents.StatusUpdated, {
          ticket,
        });

        await ticket.save();
      }
    }
  }
}
