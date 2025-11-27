class DepartmentPerformance {
  /**
   * ID del departamento
   * @example 507f1f77bcf86cd799439011
   */
  departmentId: string;

  /**
   * Nombre del departamento
   * @example Soporte Técnico
   */
  departmentName: string;

  /**
   * Total de tickets del departamento
   * @example 200
   */
  totalTickets: number;

  /**
   * Tickets abiertos
   * @example 30
   */
  openTickets: number;

  /**
   * Tickets resueltos
   * @example 120
   */
  resolvedTickets: number;

  /**
   * Tickets cerrados
   * @example 50
   */
  closedTickets: number;

  /**
   * Tickets de alta prioridad
   * @example 45
   */
  highPriorityTickets: number;

  /**
   * Tasa de resolución en porcentaje
   * @example 85.0
   */
  resolutionRate: number;
}

export class DepartmentMetricsResponse {
  /**
   * Lista de métricas por departamento
   */
  departments: DepartmentPerformance[];
}
