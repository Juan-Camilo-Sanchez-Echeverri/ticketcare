export interface WhatsAppWebhookDto {
  object: string;
  entry: WhatsAppEntry[];
}

export interface WhatsAppEntry {
  id: string;
  changes: WhatsAppChange[];
}

export interface WhatsAppChange {
  value: WhatsAppValue;
  field: string;
}

export interface WhatsAppValue {
  messaging_product?: string;
  metadata?: WhatsAppMetadata;
  statuses?: WhatsAppStatus[];
  messages?: WhatsAppMessage[];
  contacts?: WhatsAppContact[];
}

export interface WhatsAppMetadata {
  display_phone_number?: string;
  phone_number_id?: string;
}

export interface WhatsAppStatus {
  id?: string;
  status?: string;
  timestamp?: string;
  recipient_id?: string;
  recipient_logical_id?: string;
  errors?: WhatsAppError[];
}

export interface WhatsAppError {
  code?: number;
  title?: string;
  message?: string;
  error_data?: {
    details?: string;
    [key: string]: unknown;
  };
}

export interface WhatsAppMessage {
  from: string;
  id?: string;
  timestamp?: string;
  type?: string;
  text?: { body?: string } | null;
  interactive?: {
    type?: string;
    button_reply?: { id?: string; title?: string } | null;
    list_reply?: { id?: string; title?: string; description?: string } | null;
  } | null;
}

export interface WhatsAppContact {
  profile?: { name?: string };
  wa_id?: string;
}

export default WhatsAppWebhookDto;
