import { IsOptional, IsString } from 'class-validator';

import { FilterDto } from '@common/dto';

import { BusinessClient } from '../schemas/business-client.schema';

export class FilterBusinessClientDto extends FilterDto<BusinessClient> {
  @IsOptional()
  @IsString()
  contractor?: string;
}
