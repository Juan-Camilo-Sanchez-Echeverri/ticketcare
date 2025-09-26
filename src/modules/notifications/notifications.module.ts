import { Module } from '@nestjs/common';

import { NotificationsService } from './notifications.service';

import { EmailNotificationService } from './providers';

@Module({
  providers: [NotificationsService, EmailNotificationService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
