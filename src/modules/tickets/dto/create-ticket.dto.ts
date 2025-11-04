import { ApiHideProperty } from '@nestjs/swagger';

import { IsEnum, IsMongoId, IsOptional } from 'class-validator';

import { IsNotBlank } from '@common/decorators';

import { PriorityTicket, TicketSource } from '../enums';

export class CreateTicketDto {
  @ApiHideProperty()
  serial?: string;

  @IsNotBlank()
  title: string;

  @IsNotBlank()
  description: string;

  @IsMongoId()
  supportDepartment: string | null;

  @IsMongoId()
  businessClient: string | null;

  @IsOptional()
  @IsEnum(PriorityTicket)
  priorityUser?: PriorityTicket;

  @IsEnum(TicketSource)
  source: TicketSource;

  @IsMongoId()
  businessContractor: string | null;

  @ApiHideProperty()
  requestingUser?: string;

  @ApiHideProperty()
  supportLevel?: string;
}
