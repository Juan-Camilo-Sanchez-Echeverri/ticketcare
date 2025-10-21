import { PartialType } from '@nestjs/mapped-types';
import { FilterQuery } from 'mongoose';

import { CreateTicketDto } from './create-ticket.dto';
import { TicketDocument } from '../schemas';
import { IsEnum, IsOptional, IsPositive, Max, Min } from 'class-validator';
import { PriorityTicket, StatusTicket } from '../enums';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  query?: FilterQuery<TicketDocument>;

  @IsOptional()
  supportLevel?: string;

  @IsOptional()
  @IsEnum(PriorityTicket)
  priorityInternal?: PriorityTicket;

  @IsOptional()
  @IsEnum(StatusTicket)
  status?: StatusTicket;

  @IsOptional()
  @IsPositive()
  @Min(1)
  @Max(5)
  qualification?: number;
}
