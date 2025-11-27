import {
  StatusTicket,
  PriorityTicket,
  TicketSource,
} from '@modules/tickets/enums';

/**
 * General metrics response
 */
export interface GeneralMetricsResponse {
  totalTickets: number;
  ticketsWithoutAgent: number;
  byStatus: Array<{
    status: StatusTicket;
    count: number;
  }>;
  byPriority: Array<{
    priority: PriorityTicket;
    count: number;
  }>;
  bySource: Array<{
    source: TicketSource;
    count: number;
  }>;
  averageResolutionTime: {
    avgTimeMs: number;
    avgTimeHours: number;
    minTimeMs: number;
    maxTimeMs: number;
  };
}

/**
 * Status metrics response
 */
export interface StatusMetricsResponse {
  statuses: Array<{
    status: StatusTicket;
    count: number;
    percentage: number;
    tickets: Array<{
      _id: string;
      serial: string;
      title: string;
      priority: PriorityTicket;
      createdAt: Date;
    }>;
  }>;
}

/**
 * Agent performance metrics
 */
export interface AgentMetricsResponse {
  agents: Array<{
    agentId: string;
    agentName: string;
    agentEmail: string;
    totalTickets: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
    closedTickets: number;
    highPriorityTickets: number;
    resolutionRate: number;
  }>;
}

/**
 * Department metrics response
 */
export interface DepartmentMetricsResponse {
  departments: Array<{
    departmentId: string;
    departmentName: string;
    totalTickets: number;
    openTickets: number;
    resolvedTickets: number;
    closedTickets: number;
    highPriorityTickets: number;
    resolutionRate: number;
  }>;
}

/**
 * Priority metrics response
 */
export interface PriorityMetricsResponse {
  priorities: Array<{
    priority: PriorityTicket;
    count: number;
    resolvedCount: number;
    avgResolutionTimeMs: number;
    avgResolutionTimeHours: number;
  }>;
}

/**
 * Source metrics response
 */
export interface SourceMetricsResponse {
  sources: Array<{
    source: TicketSource;
    count: number;
    resolvedCount: number;
    resolutionRate: number;
  }>;
}

/**
 * Resolution time metrics response
 */
export interface ResolutionTimeMetricsResponse {
  overall: {
    avgTimeMs: number;
    avgTimeHours: number;
    avgTimeDays: number;
    minTimeMs: number;
    maxTimeMs: number;
    ticketsResolved: number;
  };
  byPriority: Array<{
    priority: PriorityTicket;
    avgTimeMs: number;
    avgTimeHours: number;
    avgTimeDays: number;
    count: number;
  }>;
}
