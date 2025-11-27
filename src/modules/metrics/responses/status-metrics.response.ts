import { PriorityTicket, StatusTicket } from '@modules/tickets/enums';

class TicketSummary {
  /**
   * ID del ticket
   * @example 507f1f77bcf86cd799439011
   */
  _id: string;

  /**
   * Serial del ticket
   * @example TK-2024-001234
   */
  serial: string;

  /**
   * Título del ticket
   * @example Error en el sistema de pagos
   */
  title: string;

  /**
   * Prioridad del ticket
   * @example HIGH
   */
  priority: PriorityTicket;

  /**
   * Fecha de creación
   * @example 2024-11-26T10:30:00.000Z
   */
  createdAt: Date;
}

class StatusDetail {
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

  /**
   * Porcentaje del total
   * @example 18.5
   */
  percentage: number;

  /**
   * Lista de tickets con este estado
   */
  tickets: TicketSummary[];
}

export class StatusMetricsResponse {
  /**
   * Detalles de métricas por estado
   */
  statuses: StatusDetail[];
}
