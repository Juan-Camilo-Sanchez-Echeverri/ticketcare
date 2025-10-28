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

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  AllRoles,
  ApiAuthResponses,
  ApiCreatedResponseWrapper,
  ApiNoContentResponseWrapper,
  ApiNotFoundResponseWrapper,
  ApiOkResponseWrapper,
  Roles,
} from '@common/decorators';

import { FilterSupportLevelPipe } from './pipes';

import {
  CreateSupportLevelDto,
  FilterSupportLevelDto,
  UpdateSupportLevelDto,
} from './dto';

import { SupportLevelsService } from './support-levels.service';

import { SupportLevelDocument } from './schemas/support-level.schema';
import { SupportLevelResponse } from './responses/support-level.response';
import { SupportLevelsErrors } from './errors/support-levels.errors';

@ApiBearerAuth()
@ApiAuthResponses()
@ApiTags('support-levels')
@Controller('support-levels')
export class SupportLevelsController {
  constructor(private readonly supportLevelsService: SupportLevelsService) {}

  /**
   *
   * Get a paginated list of support levels with filters.
   *
   * @remarks
   *
   * Retrieves all support levels with pagination and filtering capabilities.
   *
   * Allows <b>all roles</b> to access this endpoint.
   */
  @Get()
  @AllRoles()
  @ApiOkResponseWrapper(SupportLevelResponse, { isArray: true })
  async filter(@Query(FilterSupportLevelPipe) query: FilterSupportLevelDto) {
    return await this.supportLevelsService.findPaginate(query);
  }

  /**
   * Get a support level by its id.
   *
   * @remarks
   * Retrieves a single support level using its unique identifier.
   *
   * Allows <b>all roles</b> to access this endpoint.
   */
  @Get(':levelId')
  @AllRoles()
  @ApiNotFoundResponseWrapper(SupportLevelsErrors.NOT_FOUND)
  @ApiOkResponseWrapper(SupportLevelResponse, { isArray: false })
  async findOne(
    @Param('levelId') levelId: string,
  ): Promise<SupportLevelDocument> {
    return await this.supportLevelsService.findOneById(levelId);
  }

  /**
   * Create a new support level.
   *
   * @remarks
   *
   * Creates a new support level in the system.
   *
   * Allows only users with roles <b>SuperUser</b>, <b>Admin</b>, and <b>Coordinator</b> to access this endpoint.
   */
  @Post()
  @Roles('SuperUser', 'Admin', 'Coordinator')
  @ApiCreatedResponseWrapper(SupportLevelResponse)
  async create(
    @Body() createSupportLevelDto: CreateSupportLevelDto,
  ): Promise<SupportLevelDocument> {
    return await this.supportLevelsService.create(createSupportLevelDto);
  }

  /**
   * Update an existing support level.
   *
   * @remarks
   *
   * Updates the details of an existing support level identified by its id.
   *
   *  Allows only users with roles <b>SuperUser</b>, <b>Admin</b>, and <b>Coordinator</b> to access this endpoint.
   */
  @Patch(':levelId')
  @Roles('SuperUser', 'Admin', 'Coordinator')
  @ApiNotFoundResponseWrapper(SupportLevelsErrors.NOT_FOUND)
  async update(
    @Param('levelId') levelId: string,
    @Body() updateSupportLevelDto: UpdateSupportLevelDto,
  ): Promise<SupportLevelDocument> {
    return await this.supportLevelsService.update(
      levelId,
      updateSupportLevelDto,
    );
  }

  /**
   * Delete a support level by its id.
   *
   * @remarks
   *
   * Deletes a support level identified by its unique identifier.
   *
   * Allows only users with roles <b>SuperUser</b>, <b>Admin</b>, and <b>Coordinator</b> to access this endpoint.
   */
  @Delete(':levelId')
  @ApiNoContentResponseWrapper()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('SuperUser', 'Admin', 'Coordinator')
  @ApiNotFoundResponseWrapper(SupportLevelsErrors.NOT_FOUND)
  async remove(
    @Param('levelId') levelId: string,
  ): Promise<SupportLevelDocument> {
    return await this.supportLevelsService.remove(levelId);
  }
}
