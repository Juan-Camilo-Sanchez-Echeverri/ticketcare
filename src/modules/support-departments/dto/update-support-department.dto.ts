import { PartialType } from '@nestjs/swagger';

import { CreateSupportDepartmentDto } from './create-support-department.dto';

export class UpdateSupportDepartmentDto extends PartialType(
  CreateSupportDepartmentDto,
) {}
