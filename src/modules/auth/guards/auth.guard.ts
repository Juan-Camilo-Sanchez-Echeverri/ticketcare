import type { Request } from 'express';

import { Reflector } from '@nestjs/core';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService, TokenExpiredError } from '@nestjs/jwt';

import { IS_PUBLIC_KEY } from '@common/decorators';

import { Status } from '@common/enums';

import { UsersService } from '@modules/users/users.service';
import { UserDocument } from '@modules/users/schemas/user.schema';

import { AuthErrors } from '../errors/auth.errors';

import { PayloadToken } from '../interfaces/payload-token.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,

    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.isPublicRoute(context);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromRequestHeader(request);

    const payload = await this.validateToken(token);

    const user = await this.checkUserValid(payload);

    this.assignRequestUser(user, request);

    return true;
  }

  private isPublicRoute(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private extractTokenFromRequestHeader(request: Request): string {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException(AuthErrors.TOKEN_NOT_FOUND);
    }

    const [type, token] = authHeader.split(' ');

    if (!type || type !== 'Bearer') {
      throw new UnauthorizedException(AuthErrors.TOKEN_NOT_FOUND);
    }

    if (!token) throw new UnauthorizedException(AuthErrors.TOKEN_NOT_FOUND);

    return token;
  }

  private async validateToken(token: string): Promise<PayloadToken> {
    try {
      return await this.jwtService.verifyAsync<PayloadToken>(token);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(AuthErrors.TOKEN_EXPIRED);
      }

      throw new UnauthorizedException(AuthErrors.INVALID_TOKEN);
    }
  }

  private async checkUserValid(payload: PayloadToken): Promise<UserDocument> {
    const user = await this.usersService.findOneById(payload.sub);

    if (user.status === Status.INACTIVE) {
      throw new UnauthorizedException(AuthErrors.USER_INACTIVE);
    }

    if (user.status === Status.DELETED) {
      throw new UnauthorizedException(AuthErrors.USER_DELETED);
    }

    return user;
  }

  private assignRequestUser(user: UserDocument, request: Request): void {
    request.user = user;

    if (!request.user) {
      throw new InternalServerErrorException(AuthErrors.UNAUTHENTICATED_USER);
    }
  }
}
