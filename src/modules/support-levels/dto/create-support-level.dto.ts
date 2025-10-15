import { IsEnum, IsOptional, IsMongoId, IsString } from 'class-validator';

import { IsNotBlank } from '@common/decorators';

import { Status } from '@common/enums';

export class CreateSupportLevelDto {
  @IsNotBlank()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsMongoId()
  businessContractor: string;
}
