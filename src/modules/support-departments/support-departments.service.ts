import { Injectable, NotFoundException } from '@nestjs/common';

import { PaginateResult, PopulateOptions } from 'mongoose';

import { Status } from '@common/enums';

import {
  CreateSupportDepartmentDto,
  FilterSupportDepartmentDto,
  UpdateSupportDepartmentDto,
} from './dto';

import { SupportDepartmentsRepository } from './repositories/support-departments.repository';

import { SupportDepartmentDocument } from './schemas/support-department.schema';

import { SupportDepartmentsErrors } from './errors/support-departments.errors';

@Injectable()
export class SupportDepartmentsService {
  private readonly match = { status: Status.ACTIVE };

  private readonly pathsPopulate: PopulateOptions[] = [
    { path: 'supportLevels', match: this.match, select: 'name' },
    { path: 'defaultLevel', match: this.match, select: 'name' },
  ];

  constructor(private readonly repository: SupportDepartmentsRepository) {}

  async findOneById(id: string): Promise<SupportDepartmentDocument> {
    const supportDepartment = await this.repository.findOneById(id);

    if (!supportDepartment) {
      throw new NotFoundException(SupportDepartmentsErrors.NOT_FOUND);
    }

    return this.populateDepartment(supportDepartment);
  }

  async findOneByQuery(
    query: FilterSupportDepartmentDto['data'],
  ): Promise<SupportDepartmentDocument | null> {
    const department = await this.repository.findOne(query);

    return department ? this.populateDepartment(department) : null;
  }

  async findPaginate(
    filterDto: FilterSupportDepartmentDto,
  ): Promise<PaginateResult<SupportDepartmentDocument>> {
    return this.repository.findPaginate(filterDto, {
      populate: this.pathsPopulate,
    });
  }

  async create(
    createSupportLevelDto: CreateSupportDepartmentDto,
  ): Promise<SupportDepartmentDocument> {
    const newDepartment = await this.repository.create(createSupportLevelDto);

    return this.populateDepartment(newDepartment);
  }

  async update(
    id: string,
    updateSupportLevelDto: UpdateSupportDepartmentDto,
  ): Promise<SupportDepartmentDocument> {
    const departmentUpdate = await this.repository.findByIdAndUpdate(
      id,
      updateSupportLevelDto,
      { new: true },
    );

    if (!departmentUpdate) {
      throw new NotFoundException(SupportDepartmentsErrors.NOT_FOUND);
    }

    return this.populateDepartment(departmentUpdate);
  }

  async remove(id: string): Promise<SupportDepartmentDocument> {
    const department = await this.repository.findByIdAndDelete(id);

    if (!department) {
      throw new NotFoundException(SupportDepartmentsErrors.NOT_FOUND);
    }

    return department;
  }

  checkStatus(department: SupportDepartmentDocument): void {
    if (department.status === Status.DELETED) {
      throw new NotFoundException(SupportDepartmentsErrors.DELETE);
    }

    if (department.status === Status.INACTIVE) {
      throw new NotFoundException(SupportDepartmentsErrors.INACTIVE);
    }
  }

  /**
   * * Private methods
   */

  private populateDepartment(
    department: SupportDepartmentDocument,
  ): Promise<SupportDepartmentDocument> {
    return department.populate(this.pathsPopulate);
  }
}
