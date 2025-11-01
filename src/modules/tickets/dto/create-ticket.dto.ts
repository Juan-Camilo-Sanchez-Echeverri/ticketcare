import { IsEnum, IsMongoId, IsOptional } from 'class-validator';

import { IsNotBlank } from '@common/decorators';

import { PriorityTicket } from '../enums';
import { ApiHideProperty } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiHideProperty()
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

  @IsMongoId()
  businessContractor: string;

  @ApiHideProperty()
  requestingUser?: string;

  @ApiHideProperty()
  requestingUserInfo: object;

  @ApiHideProperty()
  supportLevel?: string;
}
