import { PickType } from '@nestjs/swagger';

import { User } from '@modules/users/schemas/user.schema';

export class CreatedByResponse extends PickType(User, [
  'firstName',
  'lastName',
  'email',
] as const) {
  /**
   *  Identifier for the user who created the resource.
   */
  _id: string;
}
