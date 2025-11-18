import { ArrayUnique, IsEnum, IsMongoId, IsOptional } from 'class-validator';

import { IsNotBlank } from '@common/decorators';

import { Status } from '@common/enums';

export class CreateSupportDepartmentDto {
  /**
   * Name of the support department.
   */
  @IsNotBlank()
  name: string;

  /**
   * Description of the support department.
   */
  @IsNotBlank()
  description: string;

  /**
   * Status of the support department.
   * Defaults to 'ACTIVE' if not provided.
   */
  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  /**
   * Array of support level IDs associated with the support department.
   */
  @ArrayUnique({ always: true })
  @IsMongoId({ each: true })
  supportLevels: string[];

  /**
   * Default support level id for the support department.
   */
  @IsMongoId()
  defaultLevel: string;
}
