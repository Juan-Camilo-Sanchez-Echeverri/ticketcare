import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import { AllRoles, Roles } from '@common/decorators';

import { AddModifiedByPipe } from '@common/pipes';

import { FilterDto } from '@common/dto';

import {
  CreateBusinessContractorDto,
  UpdateBusinessContractorDto,
} from './dto';

import { BusinessContractorsService } from './business-contractors.service';

import { BusinessContractorDocument } from './schemas/business-contractor.schema';

@ApiTags('business-contractors')
@Controller('business-contractors')
export class BusinessContractorsController {
  constructor(
    private readonly businessContractorsService: BusinessContractorsService,
  ) {}

  /**
   * Filter business contractors with pagination
   * Only SuperUser can access this endpoint
   */
  @Get()
  @Roles('SuperUser')
  async filter(@Query() query: FilterDto<BusinessContractorDocument>) {
    return await this.businessContractorsService.findPaginate(query);
  }

  @Get(':contractorId')
  @AllRoles()
  async findOne(
    @Param('contractorId') contractorId: string,
  ): Promise<BusinessContractorDocument> {
    return await this.businessContractorsService.findOneById(contractorId);
  }

  @Post()
  @Roles('SuperUser')
  async create(
    @Body(AddModifiedByPipe)
    createBusinessContractorDto: CreateBusinessContractorDto,
  ): Promise<BusinessContractorDocument> {
    const newContractor = await this.businessContractorsService.create(
      createBusinessContractorDto,
    );

    return newContractor;
  }

  @Patch(':contractorId')
  @Roles('SuperUser', 'Admin')
  async update(
    @Param('contractorId') contractorId: string,
    @Body() updateBusinessContractorDto: UpdateBusinessContractorDto,
  ): Promise<BusinessContractorDocument> {
    return await this.businessContractorsService.update(
      contractorId,
      updateBusinessContractorDto,
    );
  }

  @Delete(':contractorId')
  @Roles('SuperUser', 'Admin')
  async remove(
    @Param('contractorId') contractorId: string,
  ): Promise<BusinessContractorDocument> {
    return await this.businessContractorsService.remove(contractorId);
  }
}
