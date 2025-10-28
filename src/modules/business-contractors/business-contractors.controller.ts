import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ApiBearerAuth, ApiConflictResponse, ApiTags } from '@nestjs/swagger';

import {
  AllRoles,
  ApiAuthResponses,
  ApiCreatedResponseWrapper,
  ApiNoContentResponseWrapper,
  ApiNotFoundResponseWrapper,
  ApiOkResponseWrapper,
  Roles,
} from '@common/decorators';

import {
  CreateBusinessContractorDto,
  UpdateBusinessContractorDto,
  FilterBusinessContractorDto,
} from './dto';

import { FilterBusinessContractorPipe } from './pipes/filter-business-contractor.pipe';

import { BusinessContractorsService } from './business-contractors.service';

import { BusinessContractorDocument } from './schemas/business-contractor.schema';

import { BusinessContractorResponse } from './responses/business-contractor.response';

import { BusinessContractorsDeleteExamples } from './swagger/business-contractors.examples';
import { BusinessContractorsErrors } from './errors/business-contractors.errors';

@ApiBearerAuth()
@ApiAuthResponses()
@ApiTags('business-contractors')
@Controller('business-contractors')
export class BusinessContractorsController {
  constructor(
    private readonly businessContractorsService: BusinessContractorsService,
  ) {}

  /**
   * Get a paginated list of business contractors with filters.
   *
   * @remarks
   * Retrieves all business contractors with pagination and filtering capabilities.
   *
   * Allows only <b>SUPERUSER</b> to access this endpoint.
   */
  @Get()
  @AllRoles()
  @ApiOkResponseWrapper(BusinessContractorResponse, { isArray: true })
  async filter(
    @Query(FilterBusinessContractorPipe) query: FilterBusinessContractorDto,
  ) {
    return await this.businessContractorsService.findPaginate(query);
  }

  /**
   * Get a business contractor by its id.
   *
   * @remarks
   * Retrieves a single business contractor using its unique identifier.
   *
   * Allows all roles to access this endpoint.
   */
  @Get(':contractorId')
  @Roles('SuperUser', 'Admin', 'Agent')
  @ApiNotFoundResponseWrapper(BusinessContractorsErrors.NOT_FOUND)
  @ApiOkResponseWrapper(BusinessContractorResponse, { isArray: false })
  async findOne(
    @Param('contractorId') contractorId: string,
  ): Promise<BusinessContractorDocument> {
    return await this.businessContractorsService.findOneById(contractorId);
  }

  /**
   * Create a new business contractor.
   *
   * @remarks
   * Creates a new business contractor in the system.
   *
   * Allows only <b>SUPERUSER</b> to create a new business contractor.
   */
  @Post()
  @Roles('SuperUser')
  @ApiCreatedResponseWrapper(BusinessContractorResponse)
  async create(
    @Body() createBusinessContractorDto: CreateBusinessContractorDto,
  ): Promise<BusinessContractorDocument> {
    const newContractor = await this.businessContractorsService.create(
      createBusinessContractorDto,
    );

    return newContractor;
  }

  /**
   * Update an existing business contractor.
   *
   * @remarks
   * Updates the details of an existing business contractor identified by its unique id.
   *
   * Allows only <b>SUPERUSER</b> and <b>ADMIN</b> to update a business contractor.
   */
  @Patch(':contractorId')
  @Roles('SuperUser')
  @ApiOkResponseWrapper(BusinessContractorResponse, { isArray: false })
  async update(
    @Param('contractorId') contractorId: string,
    @Body() updateBusinessContractorDto: UpdateBusinessContractorDto,
  ): Promise<BusinessContractorDocument> {
    return await this.businessContractorsService.update(
      contractorId,
      updateBusinessContractorDto,
    );
  }

  /**
   * Delete a business contractor by its id.
   * @remarks
   *
   * Removes a business contractor from the system using its unique identifier.
   *
   * Allows only <b>SUPERUSER</b> and <b>ADMIN</b> to delete a business contractor.
   */
  @Delete(':contractorId')
  @Roles('SuperUser')
  @ApiNoContentResponseWrapper()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiConflictResponse({ examples: BusinessContractorsDeleteExamples })
  async remove(
    @Param('contractorId') contractorId: string,
  ): Promise<BusinessContractorDocument> {
    return await this.businessContractorsService.remove(contractorId);
  }
}
