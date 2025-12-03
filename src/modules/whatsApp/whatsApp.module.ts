import { Module } from '@nestjs/common';

import { UsersModule } from '@modules/users/users.module';
import { TicketsModule } from '@modules/tickets/tickets.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';

import { WhatsAppController } from './whatsApp.controller';

import { WhatsAppService } from './whatsApp.service';
import { WhatsAppEvents } from './events/whatsApp.events';
import { MessageHandler } from './message-handler.provider';

@Module({
  imports: [UsersModule, TicketsModule, NotificationsModule],
  providers: [WhatsAppService, WhatsAppEvents, MessageHandler],
  controllers: [WhatsAppController],
  exports: [WhatsAppService],
})
export class WhatsAppModule {}
