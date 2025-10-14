import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

import { IsNotBlank } from '@common/decorators';

import { Address } from '@common/dto';

import { BusinessDocumentType, Status, TypeActivity } from '@common/enums';

export class CreateBusinessContractorDto {
  @IsNotBlank()
  name: string;

  @IsEnum(BusinessDocumentType)
  documentType: BusinessDocumentType;

  @IsNotBlank()
  document: string;

  @IsNotBlank()
  phone: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsEmail()
  email: string;

  @IsEnum(TypeActivity)
  typeActivity: TypeActivity;

  @IsNotEmpty()
  @Type(() => Address)
  @ValidateNested({ each: true })
  address: Address;
}
