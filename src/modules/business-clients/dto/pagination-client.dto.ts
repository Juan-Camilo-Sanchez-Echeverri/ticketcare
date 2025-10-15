import { IsOptional, IsString } from 'class-validator';

import { FilterDto } from '@common/dto';

import { BusinessClientDocument } from '../schemas/business-client.schema';

export class PaginationClientDto extends FilterDto<BusinessClientDocument> {
  @IsOptional()
  @IsString()
  contractor?: string;
}
