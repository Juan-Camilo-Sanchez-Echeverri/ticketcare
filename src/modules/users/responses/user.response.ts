import { OmitType } from '@nestjs/swagger';

import { CreatedByResponse } from '@common/responses';

import { User } from '../schemas/user.schema';

export class UserResponse extends OmitType(User, ['modifiedBy'] as const) {
  /**
   *  Identifier for the user.
   */
  _id: string;

  /**
   *  Created by information of the user.
   */
  modifiedBy: CreatedByResponse;
}
