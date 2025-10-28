import { ArrayUnique, IsMongoId, IsOptional } from 'class-validator';

export class UserDetailsDto {
  /**
   * ids of the support departments associated with the user.
   */
  @IsOptional()
  @ArrayUnique({ always: true })
  @IsMongoId({ each: true })
  supportDepartments?: string[];

  /**
   * ids of the support levels associated with the user.
   */
  @IsOptional()
  @ArrayUnique({ always: true })
  @IsMongoId({ each: true })
  supportLevels?: string[];

  /**
   * ids of the business contractors associated with the user.
   */
  @IsOptional()
  @ArrayUnique({ always: true })
  @IsMongoId({ each: true })
  businessContractors?: string[];

  /**
   * ids of the business clients associated with the user.
   */
  @IsOptional()
  @ArrayUnique({ always: true })
  @IsMongoId({ each: true })
  businessClients?: string[];
}
