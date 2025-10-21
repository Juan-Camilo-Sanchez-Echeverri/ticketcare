import { Request } from 'express';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TicketsService } from '../tickets.service';

@Injectable()
export class OwnActivityTicketGuard implements CanActivate {
  constructor(private readonly ticketsService: TicketsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const activityId = request.params.activityId;
    const ticketId = request.params.ticketId;

    await this.ticketsService.checkAndUpdateActivity(ticketId, activityId);
    return true;
  }
}
