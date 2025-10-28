import { PartialType } from '@nestjs/swagger';

import { CreateSupportLevelDto } from './create-support-level.dto';

export class UpdateSupportLevelDto extends PartialType(CreateSupportLevelDto) {}
