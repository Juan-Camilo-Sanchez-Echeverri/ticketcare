import { ApiHideProperty } from '@nestjs/swagger';

import { Allow, IsMongoId, IsNotEmpty } from 'class-validator';

import type { UserDocument } from '@modules/users/schemas';

import type { SupportDepartmentDocument } from '@modules/support-departments/schemas/support-department.schema';

import type { TicketDocument } from '../schemas';

export class TransferDepartmentDto {
  @IsNotEmpty()
  @IsMongoId()
  supportDepartment: string;

  @Allow()
  @ApiHideProperty()
  requestingUser: UserDocument;

  @Allow()
  @ApiHideProperty()
  departmentInfo: SupportDepartmentDocument;

  @Allow()
  @ApiHideProperty()
  ticket: TicketDocument;

  @Allow()
  @ApiHideProperty()
  unsetAssignedUser: boolean;
}
