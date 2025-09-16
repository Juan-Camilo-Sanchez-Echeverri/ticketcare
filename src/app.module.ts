import { APP_FILTER, APP_GUARD } from '@nestjs/core';

import { Module } from '@nestjs/common';

import { ThrottlerModule, ThrottlerGuard, seconds } from '@nestjs/throttler';

import { HttpExceptionFilter } from '@common/filters';

@Module({
  imports: [
    // Global common modules
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 50,
          ttl: seconds(60),
        },
      ],
      errorMessage: 'Too many requests, please try again later.',
    }),
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
