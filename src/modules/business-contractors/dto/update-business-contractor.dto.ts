import { PartialType } from '@nestjs/swagger';

import { CreateBusinessContractorDto } from './create-business-contractor.dto';

export class UpdateBusinessContractorDto extends PartialType(
  CreateBusinessContractorDto,
) {}
