import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { Status } from '@common/enums';

import { SupportLevelsService } from '@modules/support-levels/support-levels.service';

import { CreateSupportDepartmentDto } from '../dto';

import { SupportDepartmentsErrors } from '../errors/support-departments.errors';

@Injectable()
export class ValidationLevelsPipe implements PipeTransform {
  constructor(private readonly supportLevelService: SupportLevelsService) {}

  async transform(
    value: CreateSupportDepartmentDto,
  ): Promise<CreateSupportDepartmentDto> {
    const { supportLevels, businessContractor } = value;

    await this.validateSupportLevels(supportLevels, businessContractor);

    return value;
  }

  private async validateSupportLevels(
    supportLevels: string[],
    businessContractor: string,
  ): Promise<void> {
    const validationPromises = supportLevels.map((level) =>
      this.validateSupportLevel(level, businessContractor),
    );

    await Promise.all(validationPromises);
  }

  private async validateSupportLevel(
    level: string,
    businessContractor: string,
  ): Promise<void> {
    const supportLevel = await this.supportLevelService.findOneByQuery({
      _id: level,
      status: Status.ACTIVE,
      businessContractor,
    });

    if (!supportLevel) {
      throw new BadRequestException(SupportDepartmentsErrors.LEVEL_MISMATCH);
    }
  }
}
