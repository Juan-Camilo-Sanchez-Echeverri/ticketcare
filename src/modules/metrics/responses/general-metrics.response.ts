import {
  PriorityTicket,
  StatusTicket,
  TicketSource,
} from '@modules/tickets/enums';

class StatusMetric {
  /**
   * Estado del ticket
   * @example OPEN
   */
  status: StatusTicket;

  /**
   * Cantidad de tickets con este estado
   * @example 45
   */
  count: number;
}

class PriorityMetric {
  /**
   * Prioridad del ticket
   * @example HIGH
   */
  priority: PriorityTicket;

  /**
   * Cantidad de tickets con esta prioridad
   * @example 12
   */
  count: number;
}

class SourceMetric {
  /**
   * Fuente del ticket
   * @example PLATFORM
   */
  source: TicketSource;

  /**
   * Cantidad de tickets de esta fuente
   * @example 78
   */
  count: number;
}

class AverageResolutionTime {
  /**
   * Tiempo promedio de resolución en milisegundos
   * @example 3600000
   */
  avgTimeMs: number;

  /**
   * Tiempo promedio de resolución en horas
   * @example 1.5
   */
  avgTimeHours: number;

  /**
   * Tiempo mínimo de resolución en milisegundos
   * @example 1800000
   */
  minTimeMs: number;

  /**
   * Tiempo máximo de resolución en milisegundos
   * @example 7200000
   */
  maxTimeMs: number;
}

export class GeneralMetricsResponse {
  /**
   * Total de tickets
   * @example 250
   */
  totalTickets: number;

  /**
   * Tickets sin agente asignado
   * @example 15
   */
  ticketsWithoutAgent: number;

  /**
   * Distribución de tickets por estado
   */
  byStatus: StatusMetric[];

  /**
   * Distribución de tickets por prioridad
   */
  byPriority: PriorityMetric[];

  /**
   * Distribución de tickets por fuente
   */
  bySource: SourceMetric[];

  /**
   * Tiempos promedio de resolución
   */
  averageResolutionTime: AverageResolutionTime;
}
