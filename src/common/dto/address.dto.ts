import { IsNotBlank } from '../decorators';

export class AddressDto {
  /**
   * Street address.
   * @example  "Av. Siempre Viva".
   */
  @IsNotBlank()
  street: string;

  /**
   * Country of the address.
   * @example  "Colombia".
   */
  @IsNotBlank()
  country: string;

  /**
   * State of the address.
   * @example  "Cundinamarca".
   */
  @IsNotBlank()
  state: string;

  /**
   * City of the address.
   * @example  "Bogotá".
   */
  @IsNotBlank()
  city: string;
}
