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

import { ApiTags } from '@nestjs/swagger';

import { Roles } from '@common/decorators';

import { FilterDto } from '@common/dto';

import { FilterSupportLevelPipe } from './pipes';

import { CreateSupportLevelDto, UpdateSupportLevelDto } from './dto';

import { SupportLevelsService } from './support-levels.service';

import { SupportLevelDocument } from './schemas/support-level.schema';

@ApiTags('support-levels')
@Controller('support-levels')
export class SupportLevelsController {
  constructor(private readonly supportLevelsService: SupportLevelsService) {}

  @Get()
  @Roles('SuperUser')
  async filter(@Body() query: FilterDto<SupportLevelDocument>) {
    return await this.supportLevelsService.findPaginate(query);
  }

  @Get(':levelId')
  @Roles('SuperUser', 'Admin', 'Coordinator')
  async findOne(
    @Param('levelId') levelId: string,
  ): Promise<SupportLevelDocument> {
    return await this.supportLevelsService.findOneById(levelId);
  }

  @Post()
  @Roles('SuperUser', 'Admin', 'Coordinator')
  async create(
    @Body() createSupportLevelDto: CreateSupportLevelDto,
  ): Promise<SupportLevelDocument> {
    return await this.supportLevelsService.create(createSupportLevelDto);
  }

  @Get('self-levels/:contractorId')
  @Roles('SuperUser', 'Admin', 'Coordinator')
  async selfLevels(
    @Param('contractorId')
    @Query(FilterSupportLevelPipe)
    query: FilterDto<SupportLevelDocument>,
  ) {
    return await this.supportLevelsService.findPaginate(query);
  }

  @Patch(':levelId')
  @Roles('SuperUser', 'Admin', 'Coordinator')
  async update(
    @Param('levelId') levelId: string,
    @Body() updateSupportLevelDto: UpdateSupportLevelDto,
  ): Promise<SupportLevelDocument> {
    return await this.supportLevelsService.update(
      levelId,
      updateSupportLevelDto,
    );
  }

  @Delete(':levelId')
  @Roles('SuperUser', 'Admin', 'Coordinator')
  async remove(
    @Param('levelId') levelId: string,
  ): Promise<SupportLevelDocument> {
    return await this.supportLevelsService.remove(levelId);
  }
}
