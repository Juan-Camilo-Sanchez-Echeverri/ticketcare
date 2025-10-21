import { IsEnum, IsMongoId, IsOptional } from 'class-validator';

import { IsNotBlank } from '@common/decorators';

import { PriorityTicket } from '../enums';

export class CreateTicketDto {
  serial?: string;

  @IsNotBlank()
  title: string;

  @IsNotBlank()
  description: string;

  @IsMongoId()
  supportDepartment: string;

  @IsMongoId()
  businessClient: string;

  @IsOptional()
  @IsEnum(PriorityTicket)
  priorityUser?: PriorityTicket;

  businessContractor: string;

  requestingUser?: string;

  requestingUserInfo: object;

  supportLevel?: string;
}
