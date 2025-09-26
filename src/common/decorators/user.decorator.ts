import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

import { UserDocument } from '@modules/users/schemas/user.schema';

import { extractUserFromRequest } from '../helpers';

export const CurrentUser = createParamDecorator(
  (data: keyof UserDocument, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = extractUserFromRequest(request);

    if (!user) return null;

    return data ? (user[data] as keyof UserDocument) : user;
  },
);
