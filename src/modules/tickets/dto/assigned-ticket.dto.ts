import { ApiHideProperty } from '@nestjs/swagger';

import { IsMongoId } from 'class-validator';

import type { UserDocument } from '@modules/users/schemas';

export class AssignedTicketDto {
  /**
   * id of the user to assign the ticket to
   */
  @IsMongoId()
  assignedUser: string;

  /**
   * User document of the person performing the assignment
   * This is populated by the pipe after validation
   */
  @ApiHideProperty()
  requestingUser: UserDocument;

  /**
   * User document of the person being assigned the ticket
   * This is populated by the pipe after validation
   */
  @ApiHideProperty()
  assignedUserInfo: UserDocument;
}
