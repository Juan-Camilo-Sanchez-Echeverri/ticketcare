import { IsEmail } from 'class-validator';

import { IsPassword } from '@common/decorators';

export class LoginAuthDto {
  /**
   * The email of the user
   */
  @IsEmail()
  email: string;

  /**
   * The password of the user
   */
  @IsPassword()
  password: string;
}
