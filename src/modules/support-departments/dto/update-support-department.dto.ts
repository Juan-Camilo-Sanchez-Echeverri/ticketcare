import { PartialType } from '@nestjs/mapped-types';
import { CreateSupportDepartmentDto } from './create-support-department.dto';

export class UpdateSupportDepartmentDto extends PartialType(
  CreateSupportDepartmentDto,
) {}
