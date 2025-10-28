import { Global, Module } from '@nestjs/common';

import { LogModule } from '@modules/log/log.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { StorageModule } from '@modules/storage/storage.module';

@Global()
@Module({
  imports: [LogModule, NotificationsModule, StorageModule],
  exports: [LogModule, NotificationsModule, StorageModule],
})
export class CommonModule {}
