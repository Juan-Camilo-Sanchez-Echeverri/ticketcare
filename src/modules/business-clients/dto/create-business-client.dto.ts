import { Type } from 'class-transformer';

import {
  IsArray,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { IsNotBlank } from '@common/decorators';
import { Address, BaseDto } from '@common/dto';
import { BusinessDocumentType, TypeActivity } from '@common/enums';

export class CreateBusinessClientDto extends BaseDto {
  @IsNotBlank()
  name: string;

  @IsEnum(BusinessDocumentType)
  documentType: BusinessDocumentType;

  @IsNotBlank()
  document: string;

  @IsNotBlank()
  phone: string;

  @IsEmail()
  email: string;

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  businessContractors: string[];

  @IsEnum(TypeActivity)
  typeActivity: TypeActivity;

  @IsNotEmpty()
  @Type(() => Address)
  @ValidateNested({ each: true })
  address: Address;
}
