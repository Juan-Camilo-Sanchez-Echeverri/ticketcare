import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { IsNotBlank, IsPassword } from '@common/decorators';

import { UserRole } from '@common/enums';
import { BaseDto } from '@common/dto';
import { UserDetailsDto } from './user-details.dto';

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

  /**
   * Additional user information (support departments, levels, contractors, and clients).
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => UserDetailsDto)
  readonly details?: UserDetailsDto;
}
