import { Module } from '@nestjs/common';
import { WhatsAppService } from './whatsApp.service';
import { WhatsAppEvents } from './events/whatsApp.events';

@Module({
  providers: [WhatsAppService, WhatsAppEvents],
  exports: [WhatsAppService],
})
export class WhatsAppModule {}
