import { PartialType } from '@nestjs/mapped-types';
import { CreateBusinessClientDto } from './create-business-client.dto';

export class UpdateBusinessClientDto extends PartialType(
  CreateBusinessClientDto,
) {}
