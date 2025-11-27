import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';

import {
  StatusTicket,
  PriorityTicket,
  TicketSource,
} from '@modules/tickets/enums';

import { TicketDocument } from '@modules/tickets/schemas';

import { MetricsFilterDto } from './dto';

import { MetricsRepository } from './repositories';

import { MetricsErrors } from './errors';

import type {
  GeneralMetricsResponse,
  StatusMetricsResponse,
  AgentMetricsResponse,
  DepartmentMetricsResponse,
  PriorityMetricsResponse,
  ResolutionTimeMetricsResponse,
  SourceMetricsResponse,
} from './interfaces';

interface AggregationCountResult {
  count: number;
}

interface AggregationGroupResult {
  _id: string;
  count: number;
}

interface ResolutionTimeResult {
  _id: null;
  avgTime: number;
  minTime: number;
  maxTime: number;
}

interface GeneralMetricsFacetResult {
  totalTickets: AggregationCountResult[];
  ticketsWithoutAgent: AggregationCountResult[];
  byStatus: AggregationGroupResult[];
  byPriority: AggregationGroupResult[];
  bySource: AggregationGroupResult[];
  averageResolutionTime: ResolutionTimeResult[];
}

interface StatusAggregationResult {
  _id: StatusTicket;
  count: number;
  tickets: Array<{
    _id: string;
    serial: string;
    title: string;
    priority: PriorityTicket;
    createdAt: Date;
  }>;
}

interface AgentAggregationResult {
  _id: string;
  agentName: string;
  agentLastName: string;
  agentEmail: string;
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  highPriorityTickets: number;
}

interface DepartmentAggregationResult {
  _id: string;
  departmentName: string;
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  highPriorityTickets: number;
}

interface PriorityAggregationResult {
  _id: PriorityTicket;
  count: number;
  resolvedCount: number;
  avgResolutionTime: number;
}

interface SourceAggregationResult {
  _id: TicketSource;
  count: number;
  resolvedCount: number;
}

interface ResolutionTimeFacetResult {
  overall: Array<{
    _id: null;
    avgTime: number;
    minTime: number;
    maxTime: number;
    count: number;
  }>;
  byPriority: Array<{
    _id: PriorityTicket;
    avgTime: number;
    count: number;
  }>;
}

@Injectable()
export class MetricsService {
  constructor(private readonly repository: MetricsRepository) {}

  async getGeneralMetrics(
    filters: MetricsFilterDto,
  ): Promise<GeneralMetricsResponse> {
    const matchStage = this.buildMatchStage(filters);

    const [result] = await this.repository.aggregate<GeneralMetricsFacetResult>(
      [
        { $match: matchStage },
        {
          $facet: {
            totalTickets: [{ $count: 'count' }],
            byStatus: [
              { $group: { _id: '$status', count: { $sum: 1 } } },
              { $sort: { count: -1 } },
            ],
            byPriority: [
              { $group: { _id: '$priorityUser', count: { $sum: 1 } } },
              { $sort: { count: -1 } },
            ],
            bySource: [
              { $group: { _id: '$source', count: { $sum: 1 } } },
              { $sort: { count: -1 } },
            ],
            averageResolutionTime: [
              {
                $match: {
                  status: { $in: [StatusTicket.RESOLVED, StatusTicket.CLOSED] },
                },
              },
              {
                $project: {
                  resolutionTime: {
                    $subtract: ['$updatedAt', '$createdAt'],
                  },
                },
              },
              {
                $group: {
                  _id: null,
                  avgTime: { $avg: '$resolutionTime' },
                  minTime: { $min: '$resolutionTime' },
                  maxTime: { $max: '$resolutionTime' },
                },
              },
            ],
            ticketsWithoutAgent: [
              { $match: { assignedUser: null } },
              { $count: 'count' },
            ],
          },
        },
      ],
    );

    const totalTickets = result?.totalTickets[0]?.count;
    const ticketsWithoutAgent = result?.ticketsWithoutAgent[0]?.count;
    const byStatus = result?.byStatus || [];
    const byPriority = result?.byPriority || [];
    const bySource = result?.bySource || [];
    const resolutionTime = result?.averageResolutionTime[0];

    return {
      totalTickets: totalTickets || 0,
      ticketsWithoutAgent: ticketsWithoutAgent || 0,
      byStatus: byStatus.map((item) => ({
        status: item._id as StatusTicket,
        count: item.count,
      })),

      byPriority: byPriority.map((item) => ({
        priority: item._id as PriorityTicket,
        count: item.count,
      })),

      bySource: bySource.map((item) => ({
        source: item._id as TicketSource,
        count: item.count,
      })),

      averageResolutionTime: {
        avgTimeMs: resolutionTime?.avgTime || 0,
        avgTimeHours: (resolutionTime?.avgTime || 0) / (1000 * 60 * 60),
        minTimeMs: resolutionTime?.minTime || 0,
        maxTimeMs: resolutionTime?.maxTime || 0,
      },
    };
  }

  async getMetricsByStatus(
    filters: MetricsFilterDto,
  ): Promise<StatusMetricsResponse> {
    const matchStage = this.buildMatchStage(filters);

    const results = await this.repository.aggregate<StatusAggregationResult>([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          tickets: {
            $push: {
              _id: '$_id',
              serial: '$serial',
              title: '$title',
              priority: '$priorityUser',
              createdAt: '$createdAt',
            },
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return {
      statuses: results.map((item) => ({
        status: item._id,
        count: item.count,
        percentage: 0,
        tickets: item.tickets,
      })),
    };
  }

  async getMetricsByAgent(
    filters: MetricsFilterDto,
  ): Promise<AgentMetricsResponse> {
    const matchStage = this.buildMatchStage(filters);

    matchStage.assignedUser = { $ne: null };

    const results = await this.repository.aggregate<AgentAggregationResult>([
      { $match: matchStage },
      {
        $lookup: {
          from: 'users',
          localField: 'assignedUser',
          foreignField: '_id',
          as: 'assignedUserData',
        },
      },
      { $unwind: '$assignedUserData' },
      {
        $group: {
          _id: '$assignedUser',
          agentName: { $first: '$assignedUserData.name' },
          agentLastName: { $first: '$assignedUserData.lastName' },
          agentEmail: { $first: '$assignedUserData.email' },
          totalTickets: { $sum: 1 },
          openTickets: {
            $sum: {
              $cond: [{ $eq: ['$status', StatusTicket.OPEN] }, 1, 0],
            },
          },
          inProgressTickets: {
            $sum: {
              $cond: [{ $eq: ['$status', StatusTicket.IN_PROGRESS] }, 1, 0],
            },
          },
          resolvedTickets: {
            $sum: {
              $cond: [{ $eq: ['$status', StatusTicket.RESOLVED] }, 1, 0],
            },
          },
          closedTickets: {
            $sum: {
              $cond: [{ $eq: ['$status', StatusTicket.CLOSED] }, 1, 0],
            },
          },
          highPriorityTickets: {
            $sum: {
              $cond: [{ $eq: ['$priorityUser', PriorityTicket.HIGH] }, 1, 0],
            },
          },
        },
      },
      { $sort: { totalTickets: -1 } },
    ]);

    return {
      agents: results.map((item) => {
        const resolvedAndClosed = item.resolvedTickets + item.closedTickets;
        const resolutionRate =
          item.totalTickets > 0
            ? (resolvedAndClosed / item.totalTickets) * 100
            : 0;

        return {
          agentId: item._id,
          agentName: `${item.agentName} ${item.agentLastName}`,
          agentEmail: item.agentEmail,
          totalTickets: item.totalTickets,
          openTickets: item.openTickets,
          inProgressTickets: item.inProgressTickets,
          resolvedTickets: item.resolvedTickets,
          closedTickets: item.closedTickets,
          highPriorityTickets: item.highPriorityTickets,
          resolutionRate,
        };
      }),
    };
  }

  async getMetricsByDepartment(
    filters: MetricsFilterDto,
  ): Promise<DepartmentMetricsResponse> {
    const matchStage = this.buildMatchStage(filters);
    matchStage.supportDepartment = { $ne: null };

    const results =
      await this.repository.aggregate<DepartmentAggregationResult>([
        { $match: matchStage },
        {
          $lookup: {
            from: 'supportdepartments',
            localField: 'supportDepartment',
            foreignField: '_id',
            as: 'supportDepartmentData',
          },
        },
        { $unwind: '$supportDepartmentData' },
        {
          $group: {
            _id: '$supportDepartment',
            departmentName: { $first: '$supportDepartmentData.name' },
            totalTickets: { $sum: 1 },
            openTickets: {
              $sum: {
                $cond: [{ $eq: ['$status', StatusTicket.OPEN] }, 1, 0],
              },
            },
            resolvedTickets: {
              $sum: {
                $cond: [{ $eq: ['$status', StatusTicket.RESOLVED] }, 1, 0],
              },
            },
            closedTickets: {
              $sum: {
                $cond: [{ $eq: ['$status', StatusTicket.CLOSED] }, 1, 0],
              },
            },
            highPriorityTickets: {
              $sum: {
                $cond: [{ $eq: ['$priorityUser', PriorityTicket.HIGH] }, 1, 0],
              },
            },
          },
        },
        { $sort: { totalTickets: -1 } },
      ]);

    return {
      departments: results.map((item) => {
        const { totalTickets } = item;
        const resolvedAndClosed = item.resolvedTickets + item.closedTickets;
        const resolutionRate =
          totalTickets > 0 ? (resolvedAndClosed / totalTickets) * 100 : 0;

        return {
          departmentId: item._id,
          departmentName: item.departmentName,
          totalTickets: item.totalTickets,
          openTickets: item.openTickets,
          resolvedTickets: item.resolvedTickets,
          closedTickets: item.closedTickets,
          highPriorityTickets: item.highPriorityTickets,
          resolutionRate,
        };
      }),
    };
  }

  async getMetricsByPriority(
    filters: MetricsFilterDto,
  ): Promise<PriorityMetricsResponse> {
    const matchStage = this.buildMatchStage(filters);

    const results = await this.repository.aggregate<PriorityAggregationResult>([
      { $match: matchStage },
      {
        $group: {
          _id: '$priorityUser',
          count: { $sum: 1 },
          resolvedCount: {
            $sum: {
              $cond: [
                {
                  $in: [
                    '$status',
                    [StatusTicket.RESOLVED, StatusTicket.CLOSED],
                  ],
                },
                1,
                0,
              ],
            },
          },
          avgResolutionTime: {
            $avg: {
              $cond: [
                {
                  $in: [
                    '$status',
                    [StatusTicket.RESOLVED, StatusTicket.CLOSED],
                  ],
                },
                { $subtract: ['$updatedAt', '$createdAt'] },
                null,
              ],
            },
          },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    return {
      priorities: results.map((item) => ({
        priority: item._id,
        count: item.count,
        resolvedCount: item.resolvedCount,
        avgResolutionTimeMs: item.avgResolutionTime || 0,
        avgResolutionTimeHours:
          (item.avgResolutionTime || 0) / (1000 * 60 * 60),
      })),
    };
  }

  async getMetricsBySource(
    filters: MetricsFilterDto,
  ): Promise<SourceMetricsResponse> {
    const matchStage = this.buildMatchStage(filters);

    const results = await this.repository.aggregate<SourceAggregationResult>([
      { $match: matchStage },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
          resolvedCount: {
            $sum: {
              $cond: [
                {
                  $in: [
                    '$status',
                    [StatusTicket.RESOLVED, StatusTicket.CLOSED],
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return {
      sources: results.map((item) => ({
        source: item._id,
        count: item.count,
        resolvedCount: item.resolvedCount,
        resolutionRate:
          item.count > 0 ? (item.resolvedCount / item.count) * 100 : 0,
      })),
    };
  }

  async getResolutionTimeMetrics(
    filters: MetricsFilterDto,
  ): Promise<ResolutionTimeMetricsResponse> {
    const matchStage = this.buildMatchStage(filters);

    matchStage.status = { $in: [StatusTicket.RESOLVED, StatusTicket.CLOSED] };

    const [result] = await this.repository.aggregate<ResolutionTimeFacetResult>(
      [
        { $match: matchStage },
        {
          $project: {
            resolutionTime: { $subtract: ['$updatedAt', '$createdAt'] },
            priority: '$priorityUser',
            status: '$status',
          },
        },
        {
          $facet: {
            overall: [
              {
                $group: {
                  _id: null,
                  avgTime: { $avg: '$resolutionTime' },
                  minTime: { $min: '$resolutionTime' },
                  maxTime: { $max: '$resolutionTime' },
                  count: { $sum: 1 },
                },
              },
            ],
            byPriority: [
              {
                $group: {
                  _id: '$priority',
                  avgTime: { $avg: '$resolutionTime' },
                  count: { $sum: 1 },
                },
              },
              { $sort: { _id: -1 } },
            ],
          },
        },
      ],
    );

    const overall = result?.overall[0];
    const byPriority = result?.byPriority || [];

    return {
      overall: {
        avgTimeMs: overall?.avgTime || 0,
        avgTimeHours: (overall?.avgTime || 0) / (1000 * 60 * 60),
        avgTimeDays: (overall?.avgTime || 0) / (1000 * 60 * 60 * 24),
        minTimeMs: overall?.minTime || 0,
        maxTimeMs: overall?.maxTime || 0,
        ticketsResolved: overall?.count || 0,
      },

      byPriority: byPriority.map((item) => ({
        priority: item._id,
        avgTimeMs: item.avgTime || 0,
        avgTimeHours: (item.avgTime || 0) / (1000 * 60 * 60),
        avgTimeDays: (item.avgTime || 0) / (1000 * 60 * 60 * 24),
        count: item.count,
      })),
    };
  }

  async getMyPerformance(
    filters: MetricsFilterDto,
  ): Promise<AgentMetricsResponse['agents'][0]> {
    if (!filters.agentId) {
      throw new UnprocessableEntityException(MetricsErrors.AGENT_ID_REQUIRED);
    }

    const matchStage = this.buildMatchStage(filters);

    matchStage.assignedUser = filters.agentId;

    const results = await this.repository.aggregate<AgentAggregationResult>([
      { $match: matchStage },
      {
        $lookup: {
          from: 'users',
          localField: 'assignedUser',
          foreignField: '_id',
          as: 'assignedUserData',
        },
      },
      { $unwind: '$assignedUserData' },
      {
        $group: {
          _id: '$assignedUser',
          agentName: { $first: '$assignedUserData.name' },
          agentLastName: { $first: '$assignedUserData.lastName' },
          agentEmail: { $first: '$assignedUserData.email' },
          totalTickets: { $sum: 1 },
          openTickets: {
            $sum: {
              $cond: [{ $eq: ['$status', StatusTicket.OPEN] }, 1, 0],
            },
          },
          inProgressTickets: {
            $sum: {
              $cond: [{ $eq: ['$status', StatusTicket.IN_PROGRESS] }, 1, 0],
            },
          },
          resolvedTickets: {
            $sum: {
              $cond: [{ $eq: ['$status', StatusTicket.RESOLVED] }, 1, 0],
            },
          },
          closedTickets: {
            $sum: {
              $cond: [{ $eq: ['$status', StatusTicket.CLOSED] }, 1, 0],
            },
          },
          highPriorityTickets: {
            $sum: {
              $cond: [{ $eq: ['$priorityUser', PriorityTicket.HIGH] }, 1, 0],
            },
          },
        },
      },
    ]);

    const [result] = results;

    if (!result) {
      return {
        agentId: filters.agentId,
        agentName: 'Unknown',
        agentEmail: '',
        totalTickets: 0,
        openTickets: 0,
        inProgressTickets: 0,
        resolvedTickets: 0,
        closedTickets: 0,
        highPriorityTickets: 0,
        resolutionRate: 0,
      };
    }

    const resolvedAndClosed = result.resolvedTickets + result.closedTickets;
    const resolutionRate =
      result.totalTickets > 0
        ? (resolvedAndClosed / result.totalTickets) * 100
        : 0;

    return {
      agentId: result._id,
      agentName: `${result.agentName} ${result.agentLastName}`,
      agentEmail: result.agentEmail,
      totalTickets: result.totalTickets,
      openTickets: result.openTickets,
      inProgressTickets: result.inProgressTickets,
      resolvedTickets: result.resolvedTickets,
      closedTickets: result.closedTickets,
      highPriorityTickets: result.highPriorityTickets,
      resolutionRate,
    };
  }

  private buildMatchStage(
    filters: MetricsFilterDto,
  ): FilterQuery<TicketDocument> {
    const match: FilterQuery<TicketDocument> = {};

    if (filters.startDate || filters.endDate) {
      const dateFilter: { $gte?: Date; $lte?: Date } = {};

      if (filters.startDate) {
        dateFilter.$gte = filters.startDate;
      }

      if (filters.endDate) {
        dateFilter.$lte = filters.endDate;
      }

      match.createdAt = dateFilter;
    }

    if (filters.status) {
      match.status = filters.status;
    }

    if (filters.priority) {
      match.priorityUser = filters.priority;
    }

    if (filters.source) {
      match.source = filters.source;
    }

    if (filters.departmentId) {
      match.supportDepartment = new Types.ObjectId(filters.departmentId);
    }

    if (filters.businessClientId) {
      match.businessClient = new Types.ObjectId(filters.businessClientId);
    }

    if (filters.businessContractorId) {
      match.businessContractor = new Types.ObjectId(
        filters.businessContractorId,
      );
    }

    return match;
  }
}
