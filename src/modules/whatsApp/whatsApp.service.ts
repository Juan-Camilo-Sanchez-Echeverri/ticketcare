import { Injectable } from '@nestjs/common';

import type { ResponseWhatsApp } from './interfaces';

import { whatsAppApi } from './api';
import { AxiosError } from 'axios';

// TODO: Manejar logs(seguimiento) para detectar errores
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
}
