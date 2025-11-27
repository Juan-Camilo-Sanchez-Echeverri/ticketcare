import { PriorityTicket } from '@modules/tickets/enums';

class PriorityDetail {
  /**
   * Nivel de prioridad
   * @example HIGH
   */
  priority: PriorityTicket;

  /**
   * Total de tickets con esta prioridad
   * @example 85
   */
  count: number;

  /**
   * Tickets resueltos con esta prioridad
   * @example 65
   */
  resolvedCount: number;

  /**
   * Tiempo promedio de resolución en milisegundos
   * @example 7200000
   */
  avgResolutionTimeMs: number;

  /**
   * Tiempo promedio de resolución en horas
   * @example 2.0
   */
  avgResolutionTimeHours: number;
}

export class PriorityMetricsResponse {
  /**
   * Lista de métricas por prioridad
   */
  priorities: PriorityDetail[];
}
