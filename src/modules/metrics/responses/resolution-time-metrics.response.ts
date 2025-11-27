import { PriorityTicket } from '@modules/tickets/enums';

class OverallResolutionTime {
  /**
   * Tiempo promedio de resolución en milisegundos
   * @example 5400000
   */
  avgTimeMs: number;

  /**
   * Tiempo promedio de resolución en horas
   * @example 1.5
   */
  avgTimeHours: number;

  /**
   * Tiempo promedio de resolución en días
   * @example 0.0625
   */
  avgTimeDays: number;

  /**
   * Tiempo mínimo de resolución en milisegundos
   * @example 1800000
   */
  minTimeMs: number;

  /**
   * Tiempo máximo de resolución en milisegundos
   * @example 86400000
   */
  maxTimeMs: number;

  /**
   * Total de tickets resueltos
   * @example 450
   */
  ticketsResolved: number;
}

class ResolutionTimeByPriority {
  /**
   * Nivel de prioridad
   * @example HIGH
   */
  priority: PriorityTicket;

  /**
   * Tiempo promedio de resolución en milisegundos
   * @example 3600000
   */
  avgTimeMs: number;

  /**
   * Tiempo promedio de resolución en horas
   * @example 1.0
   */
  avgTimeHours: number;

  /**
   * Tiempo promedio de resolución en días
   * @example 0.0417
   */
  avgTimeDays: number;

  /**
   * Cantidad de tickets resueltos
   * @example 120
   */
  count: number;
}

export class ResolutionTimeMetricsResponse {
  /**
   * Tiempos de resolución generales
   */
  overall: OverallResolutionTime;

  /**
   * Tiempos de resolución por prioridad
   */
  byPriority: ResolutionTimeByPriority[];
}
