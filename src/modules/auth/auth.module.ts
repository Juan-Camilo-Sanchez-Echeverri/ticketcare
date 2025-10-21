import { Module } from '@nestjs/common';

import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

import { envs } from '@configs/envs';

import { UsersModule } from '@modules/users/users.module';
import { EmailRequestModule } from '@modules/email-request/email-request.module';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    EmailRequestModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: (): JwtModuleOptions => {
        return {
          secret: envs.jwtSecret,
          signOptions: { expiresIn: envs.jwtExpiration },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
