import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

import { extractUserFromRequest, validateObjectId } from '@common/helpers';

import { UserRole } from '@common/enums';

import { UserDocument } from '@modules/users/schemas';

import { TicketsService } from '../tickets.service';
import { TicketDocument } from '../schemas';

@Injectable()
export class OwnTicketGuard implements CanActivate {
  constructor(private readonly ticketsService: TicketsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = extractUserFromRequest(request);

    const ticketId = request.params.ticketId;
    validateObjectId(ticketId);

    const ticket = await this.ticketsService.findOneById(ticketId);

    if (user.role === UserRole.SuperUser) return true;

    const isUserAuthorized = this.isUserAuthorized(user, ticket);

    if (!isUserAuthorized) return false;

    return true;
  }

  private isUserAuthorized(
    user: UserDocument,
    ticket: TicketDocument,
  ): boolean {
    const isContractorAuthorized = this.checkUserContractor(user, ticket);
    const isRequestingAuthorized = this.checkUserRequesting(user, ticket);

    this.validateTicketAssignment(user, ticket);

    const hasAccess = isContractorAuthorized || isRequestingAuthorized;

    return hasAccess;
  }

  private checkUserContractor(
    user: UserDocument,
    ticket: TicketDocument,
  ): boolean {
    const contractorId = ticket.businessContractor._id;
    const businessContractors = user.details.businessContractors;

    return businessContractors?.some(
      (contractor) => contractor._id === contractorId,
    );
  }

  private checkUserRequesting(
    user: UserDocument,
    ticket: TicketDocument,
  ): boolean {
    const requestingUser = ticket.requestingUser;

    return user._id === requestingUser._id;
  }

  validateTicketAssignment(user: UserDocument, ticket: TicketDocument): void {
    const rolePermission = user.role === UserRole.Agent;
    const ticketAssigned = Boolean(ticket.assignedUser?._id);
    const isMeTicket = ticket?.assignedUser?._id === user._id;

    const unauthorizedAssignment =
      ticketAssigned && !isMeTicket && rolePermission;

    if (unauthorizedAssignment) {
      throw new ForbiddenException();
    }
  }
}
