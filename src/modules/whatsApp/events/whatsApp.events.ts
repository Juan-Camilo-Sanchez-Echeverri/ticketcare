import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { TicketEvents } from '@common/enums';

import {
  agentsManagementTemplate,
  statusTemplate,
  ticketCreateAgentsTemplate,
} from '@modules/whatsApp/templates';

import { WhatsAppService } from '../whatsApp.service';

import type { ChangeStatus, NotificationAgents } from '../interfaces';

@Injectable()
export class WhatsAppEvents {
  constructor(private readonly whatsAppService: WhatsAppService) {}

  @OnEvent(TicketEvents.StatusUpdated)
  async ticketStatusChange({ ticket }: ChangeStatus) {
    const data = statusTemplate(ticket, ticket.requestingUser);

    await this.whatsAppService.send(data);
  }

  @OnEvent(TicketEvents.CreateTicket)
  async notificationAgents({ ticket, user }: NotificationAgents) {
    const data = ticketCreateAgentsTemplate(ticket, user);

    await this.whatsAppService.send(data);
  }

  @OnEvent(TicketEvents.AgentsManagement)
  async agentsManagement({ ticket, user }: NotificationAgents) {
    const data = agentsManagementTemplate(ticket, user);

    await this.whatsAppService.send(data);
  }
}
