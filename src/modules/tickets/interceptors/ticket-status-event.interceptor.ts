import type { Request } from 'express';

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { EventEmitter2 } from '@nestjs/event-emitter';

import { mergeMap } from 'rxjs/operators';

import { Status, TicketEvents, UserRole } from '@common/enums';
import { extractUserFromRequest } from '@common/helpers';

import { UserDocument } from '@modules/users/schemas';
import { UsersService } from '@modules/users/users.service';

import type { TicketDocument } from '../schemas';

@Injectable()
export class TicketStatusEventInterceptor implements NestInterceptor {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly usersService: UsersService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<Request>();

    const { status, assignedUser } = request.body as {
      status: Status;
      assignedUser: string;
    };

    const user = extractUserFromRequest(request);

    return next.handle().pipe(
      mergeMap(async (ticket: TicketDocument) => {
        if (status !== undefined || this.isSpecialRequest(request)) {
          await this.emitStatusUpdated(ticket);

          if (assignedUser !== user.id) await this.emitAgentEvent(ticket, user);
        }
        return ticket;
      }),
    );
  }

  private async emitStatusUpdated(ticket: TicketDocument): Promise<void> {
    await this.eventEmitter.emitAsync(TicketEvents.StatusUpdated, { ticket });
  }

  private async emitAgentEvent(
    ticket: TicketDocument,
    user: UserDocument,
  ): Promise<void> {
    if (!ticket.assignedUser) {
      const agents = await this.listAgentsActive(ticket);
      await this.emitEventAgents(ticket, agents);
      return;
    }

    if (user._id !== ticket.assignedUser._id) {
      await this.eventEmitter.emitAsync(TicketEvents.AgentsManagement, {
        ticket,
        user: ticket.assignedUser,
      });
    }
  }

  private async listAgentsActive(
    ticket: TicketDocument,
  ): Promise<UserDocument[]> {
    return this.usersService.findByQuery({
      role: UserRole.Agent,
      status: Status.ACTIVE,
      'details.supportDepartments': { $in: [ticket.supportDepartment._id] },
      'details.supportLevels': { $in: [ticket.supportLevel._id] },
      'details.businessContractors': ticket.businessContractor._id,
    });
  }

  private async emitEventAgents(
    ticket: TicketDocument,
    agents: UserDocument[],
  ): Promise<void> {
    await Promise.all(
      agents.map((agent) =>
        this.eventEmitter.emitAsync(TicketEvents.AgentsManagement, {
          ticket,
          user: agent,
        }),
      ),
    );
  }

  private isSpecialRequest(request: Request): boolean {
    const specialKeywords = ['transfer-department', 'assign', 'transfer-level'];
    return specialKeywords.some((keyword) => request.url.includes(keyword));
  }
}
