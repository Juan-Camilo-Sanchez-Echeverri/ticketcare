import { ArrayUnique, IsEnum, IsMongoId, IsOptional } from 'class-validator';

import { IsNotBlank } from '@common/decorators';

import { Status } from '@common/enums';

export class CreateSupportDepartmentDto {
  @IsNotBlank()
  name: string;

  @IsNotBlank()
  description: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @ArrayUnique({ always: true })
  @IsMongoId({ each: true })
  supportLevels: string[];

  @IsMongoId()
  defaultLevel: string;

  @IsMongoId()
  businessContractor: string;
}
