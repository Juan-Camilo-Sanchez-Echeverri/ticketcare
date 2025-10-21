import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { UpdateTicketDto } from './update-ticket.dto';

export class AssignedTicketDto extends UpdateTicketDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  assignedUser?: string;
}
