import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { EventEmitter2 } from '@nestjs/event-emitter';

import { mergeMap } from 'rxjs/operators';

import { UserRole, Status, TicketEvents } from '@common/enums';

import { UsersService } from '@modules/users/users.service';

import { TicketDocument } from '../schemas';

@Injectable()
export class TicketCreationEventInterceptor implements NestInterceptor {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly usersService: UsersService,
  ) {}

  intercept(_context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      mergeMap(async (ticket: TicketDocument) => {
        await this.eventEmitter.emitAsync(TicketEvents.StatusUpdated, {
          ticket,
        });

        const agentsContractors = await this.usersService.findByQuery({
          role: UserRole.Agent,
          status: Status.ACTIVE,
          'details.supportDepartments': { $in: [ticket.supportDepartment._id] },
          'details.supportLevels': { $in: [ticket.supportLevel._id] },
          'details.businessContractors': ticket.businessContractor._id,
        });

        await Promise.all(
          agentsContractors.map((agent) =>
            this.eventEmitter.emitAsync(TicketEvents.CreateTicket, {
              ticket,
              user: agent,
            }),
          ),
        );
        return ticket;
      }),
    );
  }
}
