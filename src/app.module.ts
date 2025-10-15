import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { ThrottlerGuard, ThrottlerModule, seconds } from '@nestjs/throttler';

import { MongooseConfigService } from '@configs';

import { LoggerMiddleware } from '@common/middlewares';

import { ParseMongoIdPipe } from '@common/pipes';

import { HttpExceptionFilter } from '@common/filters';

import { CommonModule } from '@common/common.module';

import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';
import { EmailRequestModule } from '@modules/email-request/email-request.module';
import { BusinessContractorsModule } from '@modules/business-contractors/business-contractors.module';
import { BusinessClientsModule } from '@modules/business-clients/business-clients.module';
import { SupportDepartmentsModule } from '@modules/support-departments/support-departments.module';
import { SupportLevelsModule } from '@modules/support-levels/support-levels.module';

@Module({
  imports: [
    // Global common modules
    MongooseModule.forRootAsync({ useClass: MongooseConfigService }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 50,
          ttl: seconds(60),
        },
      ],
      errorMessage: 'Too many requests, please try again later.',
    }),
    CommonModule,

    // Application modules
    UsersModule,
    AuthModule,
    EmailRequestModule,
    BusinessContractorsModule,
    BusinessClientsModule,
    SupportDepartmentsModule,
    SupportLevelsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_PIPE, useClass: ParseMongoIdPipe },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('{*splat}');
  }
}
