import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { compare } from 'bcrypt';

import { Status } from '@common/enums';

import { UsersService } from '@modules/users/users.service';
import { UserDocument } from '@modules/users/schemas/user.schema';

import { LoginAuthDto, RecoverPasswordDto, ResetPasswordDto } from './dto';

import { AuthErrors } from './errors/auth.errors';

import {
  LoginResponse,
  RecoverPasswordResponse,
  ResetPasswordResponse,
} from './responses';
import { EmailRequestService } from '../email-request/email-request.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailRequestService: EmailRequestService,
  ) {}

  async login(loginAuthDto: LoginAuthDto): Promise<LoginResponse> {
    const { email, password } = loginAuthDto;

    const user = await this.usersService.findOneByQuery({ email });

    if (!user) throw new UnauthorizedException(AuthErrors.USER_EMAIL_NOT_FOUND);

    this.validateUser(user);

    const matchPassword = await compare(password, user.password);

    if (!matchPassword) {
      throw new UnauthorizedException(AuthErrors.PASSWORD_MISMATCH);
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user._id,
      role: user.role,
    });

    return { accessToken };
  }

  async recoverPassword(
    recoverPasswordDto: RecoverPasswordDto,
  ): Promise<RecoverPasswordResponse> {
    const { email } = recoverPasswordDto;

    const user = await this.usersService.findOneByQuery({ email });

    if (!user) throw new UnauthorizedException(AuthErrors.EMAIL_NOT_FOUND);

    const expiresIn = new Date(Date.now() + 10 * 60 * 1000);
    await this.emailRequestService.create({
      email,
      type: 'recoverPassword',
      expiresIn,
    });

    return { send: true };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponse> {
    const { email, password } = resetPasswordDto;

    const user = await this.usersService.findOneByQuery({ email });
    if (!user) throw new UnauthorizedException(AuthErrors.EMAIL_NOT_FOUND);

    await this.usersService.update(String(user._id), {
      password,
    });

    return { changed: true };
  }

  private validateUser(user: UserDocument) {
    if (user.status === Status.INACTIVE) {
      throw new UnauthorizedException(AuthErrors.USER_INACTIVE);
    }

    if (user.status === Status.DELETED) {
      throw new UnauthorizedException(AuthErrors.USER_NOT_FOUND);
    }
  }
}
