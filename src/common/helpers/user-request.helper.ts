import type { Request } from 'express';

import { UserDocument } from '@modules/users/schemas/user.schema';

export const extractUserFromRequest = (
  request: Request,
): UserDocument | null => {
  return request.user ? request.user : null;
};
