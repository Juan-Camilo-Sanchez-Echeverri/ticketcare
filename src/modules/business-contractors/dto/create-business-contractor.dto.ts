import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

import { IsNotBlank } from '@common/decorators';

import { AddressDto } from '@common/dto';

import { BusinessDocumentType, Status, TypeActivity } from '@common/enums';

export class CreateBusinessContractorDto {
  /**
   * Name of the business contractor.
   */
  @IsNotBlank()
  name: string;

  /**
   * Type of document of the business contractor.
   */
  @IsEnum(BusinessDocumentType)
  documentType: BusinessDocumentType;

  /**
   * Document number of the business contractor.
   */
  @IsNotBlank()
  document: string;

  /**
   * Phone number of the business contractor.
   */
  @IsNotBlank()
  phone: string;

  /**
   * Status of the business contractor.
   */
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  /**
   * Email of the business contractor.
   * Must be a valid email format.
   */
  @IsEmail()
  email: string;

  /**
   * Type of activity of the business contractor.
   */
  @IsEnum(TypeActivity)
  typeActivity: TypeActivity;

  /**
   * Address of the business contractor.
   */
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
