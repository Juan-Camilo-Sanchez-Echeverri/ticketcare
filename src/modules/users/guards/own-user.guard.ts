import { Request } from 'express';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { extractUserFromRequest, validateObjectId } from '@common/helpers';

import { UserRole } from '@common/enums';

import { UsersService } from '../users.service';

import { UserDocument } from '../schemas';

@Injectable()
export class OwnUserGuard implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const currentUser = extractUserFromRequest(request);
    const targetUserId = request.params.userId;
    validateObjectId(targetUserId);

    const targetUser = await this.userService.findOneById(targetUserId);

    if (currentUser.role === UserRole.SuperUser) return true;

    const isClient = this.isClient(currentUser, targetUser);
    const isContractorClient = this.isContractorClient(currentUser, targetUser);
    const isContractor = this.isContractor(currentUser, targetUser);

    const isUnauthorized = !isClient && !isContractorClient && !isContractor;

    if (isUnauthorized) return false;

    this.userService.checkStatusUser(targetUser);

    return true;
  }

  private isClient(currentUser: UserDocument, targetUser: UserDocument) {
    return currentUser.details.businessClients?.some((clientInCurrentUser) =>
      targetUser.details.businessClients.map(
        (client) => client._id === clientInCurrentUser._id,
      ),
    );
  }

  private isContractorClient(
    currentUser: UserDocument,
    targetUser: UserDocument,
  ) {
    const currentUserContractorIds =
      currentUser.details.businessContractors.map(
        (contractor) => contractor._id,
      );

    return targetUser.details.businessClients?.some((client) =>
      client.businessContractors.some((contractor) =>
        currentUserContractorIds.includes(contractor._id),
      ),
    );
  }

  private isContractor(currentUser: UserDocument, targetUser: UserDocument) {
    const currentUserContractorsIds =
      currentUser.details.businessContractors.map(
        (contractor) => contractor._id,
      );

    return targetUser.details.businessContractors?.some((contractor) =>
      currentUserContractorsIds.includes(contractor._id),
    );
  }
}
