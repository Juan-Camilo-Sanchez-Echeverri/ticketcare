import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';

import { AllRoles, Roles } from '@common/decorators';

import { FilterDto } from '@common/dto';

import { ApiTags } from '@nestjs/swagger';

import {
  CreateBusinessClientDto,
  PaginationClientDto,
  UpdateBusinessClientDto,
} from './dto';

import { FilterBusinessClientPipe } from './pipes';

import { BusinessClientsService } from './business-clients.service';

import { BusinessClientDocument } from './schemas/business-client.schema';

@ApiTags('business-clients')
@Controller('business-clients')
export class BusinessClientsController {
  constructor(
    private readonly businessClientsService: BusinessClientsService,
  ) {}

  @Get(':clientId')
  @AllRoles()
  async findOne(
    @Param('clientId') clientId: string,
  ): Promise<BusinessClientDocument> {
    return await this.businessClientsService.findOneById(clientId);
  }

  @Post()
  @Roles('SuperUser', 'Admin', 'Coordinator')
  async create(
    @Body() createBusinessClientDto: CreateBusinessClientDto,
  ): Promise<BusinessClientDocument> {
    return await this.businessClientsService.create(createBusinessClientDto);
  }

  @Get('filter')
  @Roles('SuperUser')
  @HttpCode(HttpStatus.OK)
  async filter(@Query() query: FilterDto<BusinessClientDocument>) {
    return await this.businessClientsService.findPaginate(query);
  }

  @Get('self-clients/:contractorId')
  @Roles('Admin', 'Coordinator')
  @HttpCode(HttpStatus.OK)
  async findSelfClients(
    @Param('contractorId')
    @Query(FilterBusinessClientPipe)
    query: PaginationClientDto,
  ) {
    return await this.businessClientsService.findPaginate(query);
  }

  @Patch(':clientId')
  @Roles('SuperUser', 'Admin', 'Coordinator')
  async update(
    @Param('clientId') clientId: string,
    @Body() updateBusinessClientDto: UpdateBusinessClientDto,
  ): Promise<BusinessClientDocument> {
    return await this.businessClientsService.update(
      clientId,
      updateBusinessClientDto,
    );
  }

  @Delete(':clientId')
  @Roles('SuperUser')
  async remove(@Param('clientId') id: string): Promise<BusinessClientDocument> {
    return await this.businessClientsService.remove(id);
  }
}
