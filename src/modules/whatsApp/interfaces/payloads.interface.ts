import { TicketDocument } from '@modules/tickets/schemas';
import { UserDocument } from '@modules/users/schemas';
export interface ChangeStatus {
  ticket: TicketDocument;
}

export interface NotificationAgents {
  ticket: TicketDocument;
  user: UserDocument;
}
