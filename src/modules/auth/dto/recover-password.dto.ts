import { IsEmail } from 'class-validator';

export class RecoverPasswordDto {
  /**
   * The email of the user requesting password recovery
   */
  @IsEmail()
  email: string;
}
