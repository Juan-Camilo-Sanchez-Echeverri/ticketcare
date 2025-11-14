import { Injectable } from '@nestjs/common';

import type { ResponseWhatsApp } from './interfaces';

import { whatsAppApi } from './api';

// TODO: Manejar logs(seguimiento) para detectar errores
@Injectable()
export class WhatsAppService {
  async send(body: object): Promise<boolean> {
    try {
      const { status } = await whatsAppApi.post<ResponseWhatsApp>('', body);

      return status === 200;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return false;
    }
  }
}
