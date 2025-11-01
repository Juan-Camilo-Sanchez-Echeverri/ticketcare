import { PartialType, ApiHideProperty } from '@nestjs/swagger';

import type { FilterQuery } from 'mongoose';

import { IsEnum, IsOptional } from 'class-validator';

import { CreateTicketDto } from './create-ticket.dto';

import { TicketDocument } from '../schemas';

import { PriorityTicket, StatusTicket } from '../enums';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  @ApiHideProperty()
  query?: FilterQuery<TicketDocument>;

  @IsOptional()
  supportLevel?: string;

  @IsOptional()
  @IsEnum(PriorityTicket)
  priorityInternal?: PriorityTicket;

  @IsOptional()
  @IsEnum(StatusTicket)
  status?: StatusTicket;
}
