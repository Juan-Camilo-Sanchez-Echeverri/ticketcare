import { Global, Module } from '@nestjs/common';

import { LogModule } from '@modules/log/log.module';

@Global()
@Module({
  imports: [LogModule],

  exports: [LogModule],
})
export class CommonModule {}
