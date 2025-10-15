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
import { BusinessDocumentType, Status, TypeActivity } from '@common/enums';

export class CreateBusinessClientDto extends BaseDto {
  @IsNotBlank({ message: 'name is required and is a string' })
  name: string;

  @IsEnum(BusinessDocumentType)
  documentType: BusinessDocumentType;

  @IsNotBlank({ message: 'document is required and is a string' })
  document: string;

  @IsNotBlank({ message: 'phone is required and is a string' })
  phone: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsEmail()
  email: string;

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  businessContractors: string[];

  @IsOptional()
  @IsEnum(TypeActivity)
  typeActivity?: TypeActivity;

  @IsNotEmpty()
  @Type(() => Address)
  @ValidateNested({ each: true })
  address: Address;
}
