import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import {
  AllRoles,
  ApiAuthResponses,
  ApiCreatedResponseWrapper,
  ApiNoContentResponseWrapper,
  ApiNotFoundResponseWrapper,
  ApiOkResponseWrapper,
  Roles,
} from '@common/decorators';

import { FilterDto } from '@common/dto';

import { FilterSupportDepartmentPipe, ValidationLevelsPipe } from './pipes';

import { CreateSupportDepartmentDto, UpdateSupportDepartmentDto } from './dto';

import { SupportDepartmentsService } from './support-departments.service';

import { SupportDepartmentDocument } from './schemas/support-department.schema';

import { SupportDepartmentResponse } from './responses/support-department.response';

import { SupportDepartmentsErrors } from './errors/support-departments.errors';

@ApiBearerAuth()
@ApiAuthResponses()
@ApiTags('support-departments')
@Controller('support-departments')
export class SupportDepartmentsController {
  constructor(
    private readonly supportDepartmentsService: SupportDepartmentsService,
  ) {}

  /**
   *
   * Get a paginated list of support departments with filters.
   *
   * @remarks
   *
   * Retrieves all support departments with pagination and filtering capabilities.
   *
   * Allows <b>all roles</b> to access this endpoint.
   */
  @Get()
  @AllRoles()
  @ApiOkResponseWrapper(SupportDepartmentResponse, { isArray: true })
  async filter(
    @Query(FilterSupportDepartmentPipe)
    query: FilterDto<SupportDepartmentDocument>,
  ) {
    return await this.supportDepartmentsService.findPaginate(query);
  }

  /**
   * Get a support department by its identifier.
   *
   * @remarks
   * Retrieves a single support department using its unique identifier.
   *
   * Allows <b>all roles</b> to access this endpoint.
   */
  @Get(':departmentId')
  @AllRoles()
  @ApiNotFoundResponseWrapper(SupportDepartmentsErrors.NOT_FOUND)
  @ApiOkResponseWrapper(SupportDepartmentResponse, { isArray: false })
  async findOne(
    @Param('departmentId') departmentId: string,
  ): Promise<SupportDepartmentDocument> {
    return await this.supportDepartmentsService.findOneById(departmentId);
  }

  /**
   * Create a new support department.
   *
   * @remarks
   *
   * Creates a new support department with the provided details.
   *
   * Allows only <b>SUPERUSER, ADMIN, and COORDINATOR</b> roles to access this endpoint.
   */
  @Post()
  @Roles('SuperUser', 'Admin', 'Coordinator')
  @ApiCreatedResponseWrapper(SupportDepartmentResponse)
  async create(
    @Body(ValidationLevelsPipe)
    createSupportDepartmentDto: CreateSupportDepartmentDto,
  ): Promise<SupportDepartmentDocument> {
    return await this.supportDepartmentsService.create(
      createSupportDepartmentDto,
    );
  }

  /**
   * Update an existing support department.
   *
   * @remarks
   *
   * Updates the details of an existing support department identified by its unique id.
   *
   * Allows only <b>SUPERUSER, ADMIN, and COORDINATOR</b> roles to access this endpoint.
   */
  @Patch(':departmentId')
  @Roles('SuperUser', 'Admin', 'Coordinator')
  @ApiNotFoundResponseWrapper(SupportDepartmentsErrors.NOT_FOUND)
  @ApiOkResponseWrapper(SupportDepartmentResponse, { isArray: false })
  async update(
    @Param('departmentId') departmentId: string,
    @Body() updateSupportDepartmentDto: UpdateSupportDepartmentDto,
  ): Promise<SupportDepartmentDocument> {
    return await this.supportDepartmentsService.update(
      departmentId,
      updateSupportDepartmentDto,
    );
  }

  /**
   * Delete a support department by its identifier.
   *
   * @remarks
   * Allows only <b>SUPERUSER, ADMIN, and COORDINATOR</b> roles to access this endpoint.
   */
  @Delete(':departmentId')
  @ApiNoContentResponseWrapper()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNotFoundResponseWrapper(SupportDepartmentsErrors.NOT_FOUND)
  @Roles('SuperUser', 'Admin', 'Coordinator')
  async remove(
    @Param('departmentId') departmentId: string,
  ): Promise<SupportDepartmentDocument> {
    return await this.supportDepartmentsService.remove(departmentId);
  }
}
