import type { Request } from 'express';

import { Reflector } from '@nestjs/core';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { IS_PUBLIC_KEY, ROLES_KEY } from '../decorators';

import { extractUserFromRequest } from '../helpers';

import { UserRole } from '../enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.isPublicRoute(context);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const roles = this.getRoles(context);
    if (!roles) return false;

    const userRoles = this.extractUserRol(request);
    const hasRoles = this.hasValidRoles(roles, userRoles);

    if (!hasRoles) return false;

    return true;
  }

  private isPublicRoute(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private getRoles(context: ExecutionContext): UserRole[] {
    return this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  hasValidRoles(validRoles: UserRole[], userRole: UserRole): boolean {
    return validRoles.includes(userRole);
  }

  extractUserRol(request: Request): UserRole {
    const user = extractUserFromRequest(request);

    return user.role;
  }
}
