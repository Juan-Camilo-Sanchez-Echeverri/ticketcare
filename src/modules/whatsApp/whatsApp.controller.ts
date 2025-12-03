import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';

import { envs } from '@configs/envs';

import { Public } from '@common/decorators';

import type { WhatsAppWebhookDto } from './dto/whatsapp-webhook.dto';

import { MessageHandler } from './message-handler.provider';

@Controller('whatsApp')
export class WhatsAppController {
  constructor(private readonly messageHandler: MessageHandler) {}

  @Get('webhook')
  @Public()
  verifyWebhook(@Query() query: { [key: string]: string }) {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    if (mode === 'subscribe' && token === envs.webhookVerifyToken) {
      console.log('Webhook verified successfully!');
      return challenge;
    } else {
      throw new ForbiddenException();
    }
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @Public()
  async handleIncoming(@Body() body: WhatsAppWebhookDto) {
    const message = body.entry?.[0]?.changes[0]?.value?.messages?.[0];
    const senderInfo = body.entry?.[0]?.changes[0]?.value?.contacts?.[0];

    if (message && senderInfo) {
      await this.messageHandler.handleIncomingMessage(message, senderInfo);
    }

    return { ok: true };
  }
}
