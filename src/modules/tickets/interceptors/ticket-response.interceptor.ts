import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { PaginateResult } from 'mongoose';

import { Request } from 'express';

import { Observable, map } from 'rxjs';

import { UserRole } from '@common/enums';
import { extractUserFromRequest } from '@common/helpers';
import { TicketDocument } from '../schemas';

interface Data {
  docs?: TicketDocument[];
  totalDocs?: number;
  limit?: number;
  totalPages?: number;
  [key: string]: any;
}

@Injectable()
export class TicketResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Data> {
    return next.handle().pipe(
      map((response): Data => {
        if (response.docs) {
          return this.handleMultipleTickets(response, context);
        } else {
          return this.handleSingleTicket(response, context);
        }
      }),
    );
  }

  handleMultipleTickets(
    response: PaginateResult<TicketDocument>,
    context: ExecutionContext,
  ): PaginateResult<TicketDocument> {
    const docs = response.docs;
    const mappedDocs = docs.map((ticket) => this.mapTicket(ticket, context));

    return {
      ...response,
      docs: mappedDocs,
    };
  }

  private handleSingleTicket(
    ticket: TicketDocument,
    context: ExecutionContext,
  ): TicketDocument {
    return this.mapTicket(ticket, context);
  }

  private mapTicket(
    ticket: TicketDocument,
    context: ExecutionContext,
  ): TicketDocument {
    const request = context.switchToHttp().getRequest<Request>();
    const user = extractUserFromRequest(request);

    if (user.role === UserRole.SuperUser) return ticket;

    const filterContractors = ticket.businessClient.businessContractors.filter(
      (contractor) => contractor._id === ticket.businessContractor._id,
    );

    const ticketCopy = {
      ...ticket.toObject(),
      businessClient: {
        ...ticket.businessClient,
        businessContractors: filterContractors,
      },
    };

    return ticketCopy as TicketDocument;
  }
}
