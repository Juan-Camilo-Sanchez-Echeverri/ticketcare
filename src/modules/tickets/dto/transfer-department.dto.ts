import { ApiHideProperty } from '@nestjs/swagger';

import { IsMongoId, IsNotEmpty } from 'class-validator';

import type { UserDocument } from '@modules/users/schemas';

import type { SupportDepartmentDocument } from '@modules/support-departments/schemas/support-department.schema';

import type { TicketDocument } from '../schemas';

export class TransferDepartmentDto {
  @IsNotEmpty()
  @IsMongoId()
  supportDepartment: string;

  @ApiHideProperty()
  requestingUser: UserDocument;

  @ApiHideProperty()
  departmentInfo: SupportDepartmentDocument;

  @ApiHideProperty()
  ticket: TicketDocument;

  @ApiHideProperty()
  unsetAssignedUser: boolean;
}
