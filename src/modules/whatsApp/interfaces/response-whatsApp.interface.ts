export interface ResponseWhatsApp {
  messaging_product: string;
  contacts: Contact[];
  messages: Message[];
}

interface Contact {
  input: string;
  wa_id: string;
}

interface Message {
  id: string;
}
