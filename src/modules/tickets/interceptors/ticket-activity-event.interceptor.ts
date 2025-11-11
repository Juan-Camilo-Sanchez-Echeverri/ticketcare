import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { mergeMap } from 'rxjs/operators';

import { EventEmitter2 } from '@nestjs/event-emitter';

import { TicketEvents } from '@common/enums';

import { TicketDocument } from '../schemas';
import { StatusTicket } from '../enums';

@Injectable()
export class TicketActivityEventInterceptor implements NestInterceptor {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  intercept(_context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      mergeMap(async (ticket: TicketDocument) => {
        await this.emitActivityEvents(ticket);

        return ticket;
      }),
    );
  }

  private async emitActivityEvents(ticket: TicketDocument): Promise<void> {
    const { requestingUser, assignedUser } = ticket;

    if (requestingUser && ticket.status !== StatusTicket.CLIENT_RESPONSE) {
      await this.eventEmitter.emitAsync(TicketEvents.StatusUpdated, {
        ticket,
      });
    }

    if (assignedUser && ticket.status !== StatusTicket.PENDING_RESPONSE) {
      await this.eventEmitter.emitAsync(TicketEvents.AgentsManagement, {
        ticket,
        user: assignedUser,
      });
    }
  }
}
