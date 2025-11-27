import { TicketSource } from '@modules/tickets/enums';

class SourceDetail {
  /**
   * Fuente del ticket
   * @example PLATFORM
   */
  source: TicketSource;

  /**
   * Total de tickets de esta fuente
   * @example 120
   */
  count: number;

  /**
   * Tickets resueltos de esta fuente
   * @example 95
   */
  resolvedCount: number;

  /**
   * Tasa de resolución en porcentaje
   * @example 79.17
   */
  resolutionRate: number;
}

export class SourceMetricsResponse {
  /**
   * Lista de métricas por fuente
   */
  sources: SourceDetail[];
}
