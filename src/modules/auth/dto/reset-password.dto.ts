import { IsEmail } from 'class-validator';

import { IsNotBlank, IsPassword } from '@common/decorators';

export class ResetPasswordDto {
  /**
   * The token for resetting the password
   * This token is usually sent to the user's email
   * and is used to verify the user's identity
   */
  @IsNotBlank()
  token: string;

  /**
   * The email of the user whose password is being reset
   */
  @IsEmail()
  email: string;

  /**
   * The new password for the user
   */
  @IsPassword()
  password: string;
}
