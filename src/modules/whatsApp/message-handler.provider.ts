import { Injectable } from '@nestjs/common';

import { WhatsAppContact, WhatsAppMessage } from './dto/whatsapp-webhook.dto';

import { WhatsAppService } from './whatsApp.service';

@Injectable()
export class MessageHandler {
  constructor(private readonly whatsAppService: WhatsAppService) {}

  private assistantState: Record<
    string,
    { step?: string; [key: string]: unknown }
  > = {};

  async handleIncomingMessage(
    message: WhatsAppMessage,
    senderInfo: WhatsAppContact,
  ) {
    if (message?.type === 'text' && message.from) {
      const incomingMessage = String(message?.text?.body)?.toLowerCase().trim();

      if (this.isGreeting(incomingMessage)) {
        await this.sendWelcomeMessage(message.from, senderInfo);
        await this.sendWelcomeMenu(message.from);
      } else {
        await this.handleMenuOption(message.from, incomingMessage);
      }

      await this.whatsAppService.markAsRead(message.id!);
    } else if (message?.type === 'interactive') {
      const option = message?.interactive?.button_reply?.id;
      await this.handleMenuOption(message.from, option!);
      await this.whatsAppService.markAsRead(message.id!);
    }
  }

  async sendWelcomeMessage(to: string, senderInfo: WhatsAppContact) {
    const name = this.getSenderName(senderInfo);
    const welcomeMessage = `Hola ${name}, Bienvenido a nuestro servicio de atención al cliente. ¿En qué puedo ayudarte hoy?`;

    await this.whatsAppService.sendMessage(to, welcomeMessage);
  }

  isGreeting(message: string): boolean {
    const greetings = ['hola', 'hello', 'hi', 'buenas tardes'];
    return greetings.includes(message);
  }

  getSenderName(senderInfo: WhatsAppContact): string {
    return senderInfo?.profile?.name || senderInfo?.wa_id || 'cliente';
  }

  async sendWelcomeMenu(to: string) {
    const menuMessage = 'Elige una Opción';
    const buttons = [
      {
        type: 'reply',
        reply: { id: 'option_1', title: 'Crear Ticket de Soporte' },
      },
    ];

    await this.whatsAppService.sendInteractiveButtons(to, menuMessage, buttons);
  }

  async handleMenuOption(to: string, option: string) {
    let response;

    switch (option) {
      case 'option_2':
        this.assistantState[to] = { step: 'question' };
        response =
          'Realiza tu Ticket de Soporte, Por Favor describe tu problema.';
        break;
      default:
        response =
          'Lo siento, no entendí tu selección, Por Favor, elige una de las opciones del menú.';
    }

    await this.whatsAppService.sendMessage(to, response);
  }
}
