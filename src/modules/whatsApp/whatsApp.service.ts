import { Injectable } from '@nestjs/common';

import { AxiosError } from 'axios';

import type { ResponseWhatsApp } from './interfaces';

import { whatsAppApi } from './api';

@Injectable()
export class WhatsAppService {
  async send(body: object): Promise<boolean> {
    try {
      const { status } = await whatsAppApi.post<ResponseWhatsApp>('', body);

      return status === 200;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error sending WhatsApp message:', error.response?.data);

        return false;
      }
      console.error('Error sending WhatsApp message:', error);
      return false;
    }
  }

  async sendMessage(to: string, body: string) {
    const data = {
      messaging_product: 'whatsapp',
      to,
      text: { body },
    };

    await this.send(data);
  }

  async sendInteractiveButtons(
    to: string,
    bodyText: string,
    buttons: unknown[],
  ) {
    const data = {
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: bodyText },
        action: {
          buttons: buttons,
        },
      },
    };

    await this.send(data);
  }

  async markAsRead(messageId: string) {
    const data = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    };

    await this.send(data);
  }
}
