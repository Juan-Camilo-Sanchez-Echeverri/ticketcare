import { ApiHideProperty } from '@nestjs/swagger';

import { Allow, IsEnum, IsMongoId, IsOptional } from 'class-validator';

import { IsNotBlank } from '@common/decorators';

import { PriorityTicket, TicketSource } from '../enums';

export class CreateTicketDto {
  @Allow()
  @ApiHideProperty()
  serial?: string;

  @IsNotBlank()
  title: string;

  @IsNotBlank()
  description: string;

  @IsMongoId()
  supportDepartment: string | null;

  @IsOptional()
  @IsMongoId()
  businessClient: string | null;

  @IsOptional()
  @IsEnum(PriorityTicket)
  priorityUser?: PriorityTicket;

  @IsEnum(TicketSource)
  source: TicketSource;

  @IsMongoId()
  businessContractor: string | null;

  @Allow()
  @ApiHideProperty()
  requestingUser?: string;

  @Allow()
  @ApiHideProperty()
  supportLevel?: string;
}
