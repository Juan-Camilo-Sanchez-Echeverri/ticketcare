import { Global, Module } from '@nestjs/common';

import { LogModule } from '@modules/log/log.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';

@Global()
@Module({
  imports: [LogModule, NotificationsModule],
  exports: [LogModule, NotificationsModule],
})
export class CommonModule {}
