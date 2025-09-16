import { APP_FILTER } from '@nestjs/core';

import { Module } from '@nestjs/common';

import { HttpExceptionFilter } from '@common/filters';

@Module({
  imports: [],
  controllers: [],
  providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class AppModule {}
