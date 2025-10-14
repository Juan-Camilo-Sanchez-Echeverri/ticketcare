import { PartialType } from '@nestjs/mapped-types';
import { CreateBusinessContractorDto } from './create-business-contractor.dto';

export class UpdateBusinessContractorDto extends PartialType(
  CreateBusinessContractorDto,
) {}
