import { applyDecorators } from '@nestjs/common';

import { IsStrongPassword, IsStrongPasswordOptions } from 'class-validator';

export const PASSWORD_VALIDATION_MESSAGE =
  'The password must be at least 6 characters long, contain at least one lowercase letter and one number.';

const optionsDefault = {
  minLength: 6,
  minLowercase: 1,
  minUppercase: 0,
  minNumbers: 1,
  minSymbols: 0,
};

export function IsPassword(options: IsStrongPasswordOptions = optionsDefault) {
  return applyDecorators(
    IsStrongPassword(options, {
      message: PASSWORD_VALIDATION_MESSAGE,
    }),
  );
}
