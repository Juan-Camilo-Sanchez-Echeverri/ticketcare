import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { AllRoles, Roles } from '@common/decorators';
import { FilterDto } from '@common/dto';

import { FilterSupportDepartmentPipe, ValidationLevelsPipe } from './pipes';

import { CreateSupportDepartmentDto, UpdateSupportDepartmentDto } from './dto';

import { SupportDepartmentsService } from './support-departments.service';

import { SupportDepartmentDocument } from './schemas/support-department.schema';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('support-departments')
@Controller('support-departments')
export class SupportDepartmentsController {
  constructor(
    private readonly supportDepartmentsService: SupportDepartmentsService,
  ) {}

  @Get()
  @Roles('SuperUser')
  async filter(@Query() query: FilterDto<SupportDepartmentDocument>) {
    return await this.supportDepartmentsService.findPaginate(query);
  }

  @Get(':departmentId')
  @AllRoles()
  async findOne(
    @Param('departmentId') departmentId: string,
  ): Promise<SupportDepartmentDocument> {
    return await this.supportDepartmentsService.findOneById(departmentId);
  }

  @Post()
  @Roles('SuperUser', 'Admin', 'Coordinator')
  async create(
    @Body(ValidationLevelsPipe)
    createSupportDepartmentDto: CreateSupportDepartmentDto,
  ): Promise<SupportDepartmentDocument> {
    return await this.supportDepartmentsService.create(
      createSupportDepartmentDto,
    );
  }

  @Get('self-departments/:contractorId')
  @AllRoles()
  async selfDepartments(
    @Param('contractorId')
    @Query(FilterSupportDepartmentPipe)
    query: FilterDto<SupportDepartmentDocument>,
  ) {
    return await this.supportDepartmentsService.findPaginate(query);
  }

  @Patch(':departmentId')
  @Roles('SuperUser', 'Admin', 'Coordinator')
  async update(
    @Param('departmentId') departmentId: string,
    @Body() updateSupportDepartmentDto: UpdateSupportDepartmentDto,
  ): Promise<SupportDepartmentDocument> {
    return await this.supportDepartmentsService.update(
      departmentId,
      updateSupportDepartmentDto,
    );
  }

  @Delete(':departmentId')
  @Roles('SuperUser', 'Admin', 'Coordinator')
  async remove(
    @Param('departmentId') departmentId: string,
  ): Promise<SupportDepartmentDocument> {
    return await this.supportDepartmentsService.remove(departmentId);
  }
}
