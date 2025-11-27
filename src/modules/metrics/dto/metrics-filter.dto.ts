import { IsEnum, IsMongoId, IsOptional, IsDate } from 'class-validator';

import { Type } from 'class-transformer';

import {
  StatusTicket,
  PriorityTicket,
  TicketSource,
} from '@modules/tickets/enums';

export class MetricsFilterDto {
  /**
   * Start date for filtering tickets (ISO 8601 format)
   */
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  /**
   * End date for filtering tickets (ISO 8601 format)
   */
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  /**
   * Filter by ticket status
   */
  @IsOptional()
  @IsEnum(StatusTicket)
  status?: StatusTicket;

  /**
   * Filter by ticket priority
   */
  @IsOptional()
  @IsEnum(PriorityTicket)
  priority?: PriorityTicket;

  /**
   * Filter by ticket source
   */
  @IsOptional()
  @IsEnum(TicketSource)
  source?: TicketSource;

  /**
   * Filter by support department ID
   */
  @IsOptional()
  @IsMongoId()
  departmentId?: string;

  /**
   * Filter by business client ID
   */
  @IsOptional()
  @IsMongoId()
  businessClientId?: string;

  /**
   * Filter by business contractor ID
   */
  @IsOptional()
  @IsMongoId()
  businessContractorId?: string;

  /**
   * Filter by assigned agent ID
   */
  @IsOptional()
  @IsMongoId()
  agentId?: string;
}
