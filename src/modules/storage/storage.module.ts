import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { LocalStrategy } from './strategies/local.storage.strategy';

@Module({
  providers: [StorageService, LocalStrategy],
  exports: [StorageService],
})
export class StorageModule {}
