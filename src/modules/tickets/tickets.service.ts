import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { EventEmitter2 } from '@nestjs/event-emitter';

import { Cron, CronExpression } from '@nestjs/schedule';

import { type PaginateModel, PopulateOptions, UpdateQuery } from 'mongoose';

import { Status, TicketEvents } from '@common/enums';

import { CreateTicketDto, PaginationTicketDto, UpdateTicketDto } from './dto';

import { getTicketSerial, validateHourDifference } from './helpers';

import { Activity, Ticket, TicketDocument } from './schemas';

import { ACTIVITY_NOT_EXIST, NOT_EXIST_TICKET } from './constants';

import { StatusTicket } from './enums';

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
    @InjectModel(Ticket.name)
    private ticketModel: PaginateModel<TicketDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findPaginate(query: PaginationTicketDto) {
    const { data, limit, page } = query;

    return await this.ticketModel.paginate(data, {
      page,
      limit,
      populate: this.pathsPopulate,
    });
  }

  async findOneById(id: TicketDocument['id']): Promise<TicketDocument> {
    const ticket = await this.ticketModel.findById(id);

    if (!ticket) throw new NotFoundException(NOT_EXIST_TICKET);

    return this.populateTicket(ticket);
  }

  async create(createTicketDto: CreateTicketDto): Promise<TicketDocument> {
    const { businessContractor } = createTicketDto;

    const serial = await getTicketSerial(this.ticketModel, businessContractor);

    const newTicket = await this.ticketModel.create({
      ...createTicketDto,
      serial,
    });

    return await this.populateTicket(newTicket);
  }

  async update(
    id: TicketDocument['id'],
    updateTicketDto: UpdateTicketDto,
  ): Promise<TicketDocument> {
    const ticketUpdate = await this.ticketModel.findByIdAndUpdate(
      id,
      updateTicketDto.query,
      { new: true },
    );

    if (!ticketUpdate) throw new NotFoundException(NOT_EXIST_TICKET);

    return await this.populateTicket(ticketUpdate);
  }

  async getActivityById(
    ticketId: TicketDocument['id'],
    activityId: string,
  ): Promise<TicketDocument['activity'][0]> {
    const ticket = await this.ticketModel.findOne(
      { _id: ticketId, 'activity._id': activityId },
      { 'activity.$': 1 },
    );

    if (!ticket) throw new NotFoundException(ACTIVITY_NOT_EXIST);

    return ticket.activity[0];
  }

  async updateActivity(
    ticketId: TicketDocument['id'],
    activityId: string,
    updateQuery: UpdateQuery<unknown>,
  ): Promise<TicketDocument> {
    const updatedTicket = await this.ticketModel.findOneAndUpdate(
      { _id: ticketId, 'activity._id': activityId },
      updateQuery,
      { new: true },
    );

    if (!updatedTicket) throw new NotFoundException(NOT_EXIST_TICKET);

    return this.populateTicket(updatedTicket);
  }

  async deleteActivity(ticketId: TicketDocument['id'], activityId: string) {
    const activity = await this.getActivityById(ticketId, activityId);

    await this.ticketModel.findOneAndUpdate(
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

    const tickets = await this.ticketModel.find({
      status: StatusTicket.RESOLVED,
    });

    const populatedTickets = await Promise.all(
      tickets.map((ticket) => this.populateTicket(ticket)),
    );

    for (const ticket of populatedTickets) {
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
