import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, type PaginateModel, PaginateResult } from 'mongoose';

import { FilterDto } from '@common/dto';
import { Status } from '@common/enums';

import {
  DELETE_SUPPORT_DEPARTMENT,
  DEPARTMENT_NAME_EXIST,
  INACTIVE_SUPPORT_DEPARTMENT,
  NOT_EXIST_DEPARTMENT_SUPPORT,
} from './constants';

import { CreateSupportDepartmentDto, UpdateSupportDepartmentDto } from './dto';

import {
  SupportDepartment,
  SupportDepartmentDocument,
} from './schemas/support-department.schema';

@Injectable()
export class SupportDepartmentsService {
  constructor(
    @InjectModel(SupportDepartment.name)
    private supportDepartmentModel: PaginateModel<SupportDepartment>,
  ) {}

  async findOneById(id: string): Promise<SupportDepartmentDocument> {
    const supportDepartment = await this.supportDepartmentModel.findById(id);

    if (!supportDepartment) {
      throw new NotFoundException(NOT_EXIST_DEPARTMENT_SUPPORT);
    }

    return this.populateDepartment(supportDepartment);
  }

  async findOneByQuery(
    query: FilterQuery<SupportDepartmentDocument>,
  ): Promise<SupportDepartmentDocument | null> {
    const department = await this.supportDepartmentModel.findOne(query);

    return department ? this.populateDepartment(department) : null;
  }

  async findPaginate(
    filterDto: FilterDto<SupportDepartmentDocument>,
  ): Promise<PaginateResult<SupportDepartmentDocument>> {
    const { data, page, limit } = filterDto;
    return this.supportDepartmentModel.paginate(data, { page, limit });
  }

  async findByQuery(
    query: FilterQuery<SupportDepartmentDocument>,
  ): Promise<SupportDepartmentDocument[]> {
    const results = await this.supportDepartmentModel.find(query);

    return await Promise.all(results.map((r) => this.populateDepartment(r)));
  }

  async create(
    createSupportLevelDto: CreateSupportDepartmentDto,
  ): Promise<SupportDepartmentDocument> {
    await this.validateName(createSupportLevelDto, null);
    const newDepartment = await this.supportDepartmentModel.create(
      createSupportLevelDto,
    );

    return this.populateDepartment(newDepartment);
  }

  async update(
    id: SupportDepartmentDocument['id'],
    updateSupportLevelDto: UpdateSupportDepartmentDto,
  ): Promise<SupportDepartmentDocument> {
    await this.validateName(updateSupportLevelDto, id);
    const departmentUpdate =
      await this.supportDepartmentModel.findByIdAndUpdate(
        id,
        updateSupportLevelDto,
        { new: true },
      );

    if (!departmentUpdate) {
      throw new NotFoundException(NOT_EXIST_DEPARTMENT_SUPPORT);
    }

    return this.populateDepartment(departmentUpdate);
  }

  async remove(id: string): Promise<SupportDepartmentDocument> {
    const department = await this.supportDepartmentModel.findByIdAndUpdate(
      id,
      { status: Status.DELETED },
      { new: true },
    );

    if (!department) {
      throw new NotFoundException(NOT_EXIST_DEPARTMENT_SUPPORT);
    }

    return department;
  }

  checkStatus(department: SupportDepartmentDocument): void {
    if (department.status === Status.DELETED) {
      throw new NotFoundException(DELETE_SUPPORT_DEPARTMENT);
    }

    if (department.status === Status.INACTIVE) {
      throw new NotFoundException(INACTIVE_SUPPORT_DEPARTMENT);
    }
  }

  /**
   * * Private methods
   */

  private populateDepartment(
    department: SupportDepartmentDocument,
  ): Promise<SupportDepartmentDocument> {
    const match = { status: Status.ACTIVE };

    return department.populate([
      { path: 'businessContractor', match, select: 'name' },
      { path: 'supportLevels', match, select: 'name' },
      { path: 'defaultLevel', match, select: 'name' },
    ]);
  }

  private async validateName(
    dto: UpdateSupportDepartmentDto,
    id: string | null,
  ): Promise<void> {
    const { name, businessContractor } = dto;

    const department = await this.findOneByQuery({
      name,
      _id: { $ne: id },
      businessContractor,
      status: Status.ACTIVE,
    });

    if (department) throw new BadRequestException(DEPARTMENT_NAME_EXIST);
  }
}
