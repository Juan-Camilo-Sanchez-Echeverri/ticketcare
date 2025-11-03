import { PartialType } from '@nestjs/swagger';

import { IsEnum, IsOptional } from 'class-validator';

import { CreateTicketDto } from './create-ticket.dto';

import { PriorityTicket, StatusTicket } from '../enums';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  @IsOptional()
  supportLevel?: string;

  @IsOptional()
  @IsEnum(PriorityTicket)
  priorityInternal?: PriorityTicket;

  @IsOptional()
  @IsEnum(StatusTicket)
  status?: StatusTicket;
}
