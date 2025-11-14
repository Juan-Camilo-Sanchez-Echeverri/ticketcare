import { Request } from 'express';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { UserRole } from '@common/enums';
import { extractUserFromRequest, validateObjectId } from '@common/helpers';

import { UserDocument } from '@modules/users/schemas';

import { SupportLevelsService } from '../support-levels.service';
import { SupportLevelDocument } from '../schemas/support-level.schema';

@Injectable()
export class OwnLevelGuard implements CanActivate {
  constructor(private readonly supportLevelsService: SupportLevelsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const user = extractUserFromRequest(request);

    const levelId = request.params.levelId;
    validateObjectId(levelId);

    const level = await this.supportLevelsService.findOneById(levelId);

    if (user.role === UserRole.SuperUser) return true;

    const isContractorAuthorized = this.checkUserContractor(user, level);
    const isClientAuthorized = this.checkUserClient(user, level);

    if (!isClientAuthorized && !isContractorAuthorized) return false;

    this.supportLevelsService.checkStatus(level);

    return true;
  }

  private checkUserClient(
    user: UserDocument,
    level: SupportLevelDocument,
  ): boolean {
    const contractorId = String(level.businessContractor._id);
    const businessClients = user.details.businessClients;

    const hasAccess = businessClients?.some((client) => {
      const contractors = client.businessContractors;
      return contractors.some(
        (contractor) => String(contractor._id) === contractorId,
      );
    });

    return hasAccess;
  }

  private checkUserContractor(
    user: UserDocument,
    level: SupportLevelDocument,
  ): boolean {
    const contractorLevelId = String(level.businessContractor._id);

    const contractorIds = user.details.businessContractors?.map((bc) =>
      String(bc._id),
    );

    return contractorIds?.includes(contractorLevelId);
  }
}
