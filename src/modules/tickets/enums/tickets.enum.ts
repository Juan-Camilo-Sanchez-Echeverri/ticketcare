export enum StatusTicket {
  OPEN = 'open',
  IN_PROGRESS = 'in-progress',
  ASSIGNED = 'assigned',
  CHANGE_AGENT = 'change-agent',
  CHANGE_DEPARTMENT = 'change-department',
  CHANGE_LEVEL = 'change-level',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  PENDING_RESPONSE = 'pending-response',
  CLIENT_RESPONSE = 'client-response',
}

export enum PriorityTicket {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum TypeContent {
  TRANSFER_AGENT = 'transfer-agent',
  TRANSFER_DEPARTMENT = 'transfer-department',
  ASSIGN = 'assign',
  TEXT = 'text',
  MULTIMEDIA = 'multimedia',
}

export enum TicketSource {
  PLATFORM = 'platform',
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
}
