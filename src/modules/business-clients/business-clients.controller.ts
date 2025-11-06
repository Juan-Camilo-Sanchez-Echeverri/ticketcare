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

import {
  AllRoles,
  ApiAuthResponses,
  ApiCreatedResponseWrapper,
  ApiNoContentResponseWrapper,
  ApiOkResponseWrapper,
  Roles,
} from '@common/decorators';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  CreateBusinessClientDto,
  FilterBusinessClientDto,
  UpdateBusinessClientDto,
} from './dto';

import { FilterBusinessClientPipe, ValidateClientRelationsPipe } from './pipes';

import { BusinessClientsService } from './business-clients.service';

import { BusinessClientDocument } from './schemas/business-client.schema';

import { BusinessClientResponse } from './responses/business-clients.response';

@ApiBearerAuth()
@ApiAuthResponses()
@ApiTags('business-clients')
@Controller('business-clients')
export class BusinessClientsController {
  constructor(
    private readonly businessClientsService: BusinessClientsService,
  ) {}

  /**
   * Get a paginated list of business clients with filters.
   * @remarks
   * Retrieves all business clients with pagination and filtering capabilities.
   *
   * Allows only <b>SUPERUSER</b> to access this endpoint.
   */
  @Get()
  @AllRoles()
  @ApiOkResponseWrapper(BusinessClientResponse, { isArray: true })
  async filter(
    @Query(FilterBusinessClientPipe) query: FilterBusinessClientDto,
  ) {
    return await this.businessClientsService.findPaginate(query);
  }

  /**
   * Get a single business client by its id.
   * @remarks
   * Retrieves a specific business client using its unique identifier.
   *
   * Allows all authenticated users to retrieve business client information.
   */
  @Get(':clientId')
  @AllRoles()
  @ApiOkResponseWrapper(BusinessClientResponse, { isArray: false })
  async findOne(
    @Param('clientId') clientId: string,
  ): Promise<BusinessClientDocument> {
    return await this.businessClientsService.findOneById(clientId);
  }

  /**
   * Create a new business client.
   * @remarks
   * Creates a new business client with the provided information.
   *
   * Allows <b>SUPERUSER</b>, <b>ADMIN</b> and <b>COORDINATOR</b> users to create business clients.
   */
  @Post()
  @ApiCreatedResponseWrapper(BusinessClientResponse)
  @Roles('SuperUser', 'Admin')
  async create(
    @Body(ValidateClientRelationsPipe)
    createBusinessClientDto: CreateBusinessClientDto,
  ): Promise<BusinessClientDocument> {
    return await this.businessClientsService.create(createBusinessClientDto);
  }

  /**
   * Update an existing business client.
   * @remarks
   * Updates the information of a specific business client using its unique identifier.
   *
   * Allows <b>SUPERUSER</b>, <b>ADMIN</b> and <b>COORDINATOR</b> users to update business clients.
   */
  @Patch(':clientId')
  @Roles('SuperUser', 'Admin')
  @ApiOkResponseWrapper(BusinessClientResponse, { isArray: false })
  async update(
    @Param('clientId') clientId: string,
    @Body(ValidateClientRelationsPipe)
    updateBusinessClientDto: UpdateBusinessClientDto,
  ): Promise<BusinessClientDocument> {
    return await this.businessClientsService.update(
      clientId,
      updateBusinessClientDto,
    );
  }

  /**
   * Delete a business client.
   * @remarks
   * Removes a specific business client from the system using its unique identifier.
   *
   * Allows only <b>SUPERUSER</b> to delete business clients.
   */
  @Delete(':clientId')
  @Roles('SuperUser')
  @ApiNoContentResponseWrapper()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('clientId') id: string): Promise<BusinessClientDocument> {
    return await this.businessClientsService.remove(id);
  }
}
