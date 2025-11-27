import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  ApiAuthResponses,
  ApiOkResponseWrapper,
  AllRoles,
  Roles,
  CurrentUser,
} from '@common/decorators';

import { MetricsService } from './metrics.service';
import { MetricsFilterDto } from './dto';

import {
  GeneralMetricsResponse,
  StatusMetricsResponse,
  AgentMetricsResponse,
  DepartmentMetricsResponse,
  PriorityMetricsResponse,
  ResolutionTimeMetricsResponse,
  SourceMetricsResponse,
  AgentPerformance,
} from './responses';

@ApiBearerAuth()
@ApiAuthResponses()
@ApiTags('metrics')
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  /**
   * Get general ticket metrics.
   *
   * @remarks
   * Returns overall statistics about tickets including total count, status distribution, and basic metrics.
   *
   * Allows users with roles <b>Admin</b> and <b>Coordinator</b> to access this endpoint.
   */
  @Get('general')
  @Roles('Admin', 'Coordinator')
  @ApiOkResponseWrapper(GeneralMetricsResponse, { isArray: false })
  async getGeneralMetrics(
    @Query() filters: MetricsFilterDto,
  ): Promise<GeneralMetricsResponse> {
    return this.metricsService.getGeneralMetrics(filters);
  }

  /**
   * Get metrics grouped by ticket status.
   *
   * @remarks
   * Returns detailed statistics for each ticket status.
   *
   * Allows users with roles <b>Admin</b> and <b>Coordinator</b> to access this endpoint.
   */
  @Get('by-status')
  @Roles('Admin', 'Coordinator')
  @ApiOkResponseWrapper(StatusMetricsResponse, { isArray: false })
  async getMetricsByStatus(
    @Query() filters: MetricsFilterDto,
  ): Promise<StatusMetricsResponse> {
    return this.metricsService.getMetricsByStatus(filters);
  }

  /**
   * Get metrics grouped by agent.
   *
   * @remarks
   * Returns performance statistics for each support agent.
   *
   * Allows users with roles <b>Admin</b> and <b>Coordinator</b> to access this endpoint.
   */
  @Get('by-agent')
  @Roles('Admin', 'Coordinator')
  @ApiOkResponseWrapper(AgentMetricsResponse, { isArray: false })
  async getMetricsByAgent(
    @Query() filters: MetricsFilterDto,
  ): Promise<AgentMetricsResponse> {
    return this.metricsService.getMetricsByAgent(filters);
  }

  /**
   * Get metrics grouped by department.
   *
   * @remarks
   * Returns statistics for each support department.
   *
   * Allows users with roles <b>Admin</b> and <b>Coordinator</b> to access this endpoint.
   */
  @Get('by-department')
  @Roles('Admin', 'Coordinator')
  @ApiOkResponseWrapper(DepartmentMetricsResponse, { isArray: false })
  async getMetricsByDepartment(
    @Query() filters: MetricsFilterDto,
  ): Promise<DepartmentMetricsResponse> {
    return this.metricsService.getMetricsByDepartment(filters);
  }

  /**
   * Get metrics grouped by priority.
   *
   * @remarks
   * Returns statistics for each priority level.
   *
   * Allows users with roles <b>Admin</b> and <b>Coordinator</b> to access this endpoint.
   */
  @Get('by-priority')
  @Roles('Admin', 'Coordinator')
  @ApiOkResponseWrapper(PriorityMetricsResponse, { isArray: false })
  async getMetricsByPriority(
    @Query() filters: MetricsFilterDto,
  ): Promise<PriorityMetricsResponse> {
    return this.metricsService.getMetricsByPriority(filters);
  }

  /**
   * Get metrics grouped by ticket source.
   *
   * @remarks
   * Returns statistics for each ticket source (platform, email, whatsapp).
   *
   * Allows users with roles <b>Admin</b> and <b>Coordinator</b> to access this endpoint.
   */
  @Get('by-source')
  @Roles('Admin', 'Coordinator')
  @ApiOkResponseWrapper(SourceMetricsResponse, { isArray: false })
  async getMetricsBySource(
    @Query() filters: MetricsFilterDto,
  ): Promise<SourceMetricsResponse> {
    return this.metricsService.getMetricsBySource(filters);
  }

  /**
   * Get resolution time metrics.
   *
   * @remarks
   * Returns statistics about ticket resolution times including average, minimum, and maximum times.
   *
   * Allows users with roles <b>Admin</b> and <b>Coordinator</b> to access this endpoint.
   */
  @Get('resolution-time')
  @Roles('Admin', 'Coordinator')
  @ApiOkResponseWrapper(ResolutionTimeMetricsResponse, { isArray: false })
  async getResolutionTimeMetrics(
    @Query() filters: MetricsFilterDto,
  ): Promise<ResolutionTimeMetricsResponse> {
    return this.metricsService.getResolutionTimeMetrics(filters);
  }

  /**
   * Get my agent metrics.
   *
   * @remarks
   * Returns performance statistics for the logged-in agent.
   *
   * Allows <b>all roles</b> to access this endpoint.
   */
  @Get('my-performance')
  @AllRoles()
  @ApiOkResponseWrapper(AgentPerformance, { isArray: false })
  async getMyPerformance(
    @Query() filters: MetricsFilterDto,
    @CurrentUser('_id') userId: string,
  ): Promise<AgentMetricsResponse['agents'][0]> {
    filters.agentId = userId;

    return this.metricsService.getMyPerformance(filters);
  }
}
