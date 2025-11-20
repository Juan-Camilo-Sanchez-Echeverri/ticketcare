import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  AllRoles,
  ApiOkResponseWrapper,
  ApiValidationResponseWrapper,
  CurrentUser,
  Public,
} from '@common/decorators';

import { UserResponse } from '@modules/users/responses/user.response';
import type { UserDocument } from '@modules/users/schemas';

import { LoginAuthDto, RecoverPasswordDto, ResetPasswordDto } from './dto';

import { AuthService } from './auth.service';

import {
  LoginResponse,
  RecoverPasswordResponse,
  ResetPasswordResponse,
} from './responses';

import { AuthExamples } from './swagger/auth.examples';

import { AuthErrors } from './errors/auth.errors';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login to your account
   *
   * @remarks Log in with credentials and return access and refresh tokens.
   *
   * @param loginAuthDto The user's login credentials.
   * @returns JWT tokens including accessToken and refreshToken.
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseWrapper(LoginResponse, { isArray: false })
  @ApiValidationResponseWrapper(AuthExamples.login)
  async login(@Body() loginAuthDto: LoginAuthDto): Promise<LoginResponse> {
    return this.authService.login(loginAuthDto);
  }

  /**
   * Recover password
   *
   * @remarks Send an email to the user with a link to recover their password.
   *
   */
  @Public()
  @Post('recover-password')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseWrapper(RecoverPasswordResponse, { isArray: false })
  @ApiValidationResponseWrapper(AuthExamples.recoverPassword)
  @ApiUnauthorizedResponse({ example: AuthErrors.EMAIL_NOT_FOUND })
  async recoverPassword(
    @Body() recoverPasswordDto: RecoverPasswordDto,
  ): Promise<RecoverPasswordResponse> {
    await this.authService.recoverPassword(recoverPasswordDto);

    return { send: true };
  }

  /**
   * Reset password
   *
   * @remarks Reset the user's password using a token sent to their email.
   *
   */
  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseWrapper(ResetPasswordResponse, { isArray: false })
  @ApiValidationResponseWrapper(AuthExamples.resetPassword)
  @ApiUnauthorizedResponse({ example: AuthErrors.EMAIL_NOT_FOUND })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponse> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  /**
   * Get current user
   *
   * @remarks Retrieve the currently authenticated user's information.
   *
   */
  @AllRoles()
  @Get('me')
  @ApiBearerAuth()
  getMe(@CurrentUser() user: UserResponse): UserResponse {
    return user;
  }

  async logout(@CurrentUser() user: UserDocument): Promise<void> {
    return this.authService.logout(user);
  }
}
