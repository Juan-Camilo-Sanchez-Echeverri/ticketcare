import { PartialType } from '@nestjs/mapped-types';
import { CreateSupportLevelDto } from './create-support-level.dto';

export class UpdateSupportLevelDto extends PartialType(CreateSupportLevelDto) {}
