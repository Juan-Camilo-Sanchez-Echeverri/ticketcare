import { PartialType } from '@nestjs/swagger';

import { CreateBusinessClientDto } from './create-business-client.dto';

export class UpdateBusinessClientDto extends PartialType(
  CreateBusinessClientDto,
) {}
