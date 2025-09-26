import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums';

export const ROLES_KEY = 'roles';
type RolesValues = (keyof typeof UserRole)[];

export const Roles = (...roles: RolesValues): CustomDecorator<string> => {
  const resolvedRoles = roles.map((role) => UserRole[role]);

  return SetMetadata(ROLES_KEY, [UserRole.SuperUser, ...resolvedRoles]);
};

export const AllRoles = (): CustomDecorator<string> => {
  return SetMetadata(ROLES_KEY, Object.values(UserRole));
};
