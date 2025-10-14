import { IsNotBlank } from '../decorators';

export class Address {
  @IsNotBlank()
  country: string;

  @IsNotBlank()
  state: string;

  @IsNotBlank()
  city: string;
}
