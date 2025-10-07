import { IsEmail, IsEnum, IsOptional, IsPhoneNumber } from 'class-validator';

import { IsNotBlank, IsPassword } from '@common/decorators';

import { UserRole } from '@common/enums';
import { BaseDto } from '@common/dto';

export class CreateUserDto extends BaseDto {
  /**
   * The first name of the user
   */
  @IsNotBlank()
  readonly name: string;

  /**
   * The last name of the user
   */
  @IsNotBlank()
  readonly lastName: string;

  /**
   * The password of the user
   */
  @IsPassword()
  password: string;

  /**
   * The email of the user
   */
  @IsEmail()
  readonly email: string;

  /**
   * The phone of the user
   */
  @IsOptional()
  @IsPhoneNumber('CO')
  readonly phone?: string;

  /**
   * The role of the user
   */
  @IsEnum(UserRole)
  readonly role: UserRole;
}
