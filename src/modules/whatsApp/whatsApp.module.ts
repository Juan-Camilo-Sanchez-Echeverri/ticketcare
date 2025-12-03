import { Module } from '@nestjs/common';
import { WhatsAppService } from './whatsApp.service';
import { WhatsAppEvents } from './events/whatsApp.events';
import { WhatsAppController } from './whatsApp.controller';
import { MessageHandler } from './message-handler.provider';

@Module({
  providers: [WhatsAppService, WhatsAppEvents, MessageHandler],
  controllers: [WhatsAppController],
  exports: [WhatsAppService],
})
export class WhatsAppModule {}
