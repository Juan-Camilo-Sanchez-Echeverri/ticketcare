export class AgentPerformance {
  /**
   * ID del agente
   * @example 507f1f77bcf86cd799439011
   */
  agentId: string;

  /**
   * Nombre completo del agente
   * @example Juan Pérez
   */
  agentName: string;

  /**
   * Email del agente
   * @example juan.perez@example.com
   */
  agentEmail: string;

  /**
   * Total de tickets asignados
   * @example 150
   */
  totalTickets: number;

  /**
   * Tickets abiertos
   * @example 25
   */
  openTickets: number;

  /**
   * Tickets en progreso
   * @example 45
   */
  inProgressTickets: number;

  /**
   * Tickets resueltos
   * @example 60
   */
  resolvedTickets: number;

  /**
   * Tickets cerrados
   * @example 20
   */
  closedTickets: number;

  /**
   * Tickets de alta prioridad
   * @example 30
   */
  highPriorityTickets: number;

  /**
   * Tasa de resolución en porcentaje
   * @example 53.33
   */
  resolutionRate: number;
}

export class AgentMetricsResponse {
  /**
   * Lista de métricas por agente
   */
  agents: AgentPerformance[];
}
