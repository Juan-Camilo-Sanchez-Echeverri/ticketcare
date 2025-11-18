import { Injectable, NotFoundException } from '@nestjs/common';

import { FilterQuery, PaginateResult } from 'mongoose';

import { FilterDto } from '@common/dto';
import { Status } from '@common/enums';

import { ICrudService } from '@common/interfaces';

import { CreateSupportLevelDto, UpdateSupportLevelDto } from './dto';

import { SupportLevelsRepository } from './repositories/support-levels.repository';

import { SupportLevelDocument } from './schemas/support-level.schema';

import { SupportLevelsErrors } from './errors/support-levels.errors';

@Injectable()
export class SupportLevelsService
  implements ICrudService<SupportLevelDocument>
{
  constructor(private repository: SupportLevelsRepository) {}

  async findOneById(id: string): Promise<SupportLevelDocument> {
    const supportLevel = await this.repository.findOneById(id);

    if (!supportLevel) {
      throw new NotFoundException(SupportLevelsErrors.NOT_FOUND);
    }

    return supportLevel;
  }

  async findOneByQuery(
    query: FilterQuery<SupportLevelDocument>,
  ): Promise<SupportLevelDocument | null> {
    const level = await this.repository.findOne(query);

    return level ? level : null;
  }

  async findPaginate(
    filterDto: FilterDto<SupportLevelDocument>,
  ): Promise<PaginateResult<SupportLevelDocument>> {
    return await this.repository.findPaginate(filterDto, {});
  }

  async create(
    createSupportLevelDto: CreateSupportLevelDto,
  ): Promise<SupportLevelDocument> {
    const newLevel = await this.repository.create(createSupportLevelDto);

    return newLevel;
  }

  async update(
    id: string,
    updateSupportLevelDto: UpdateSupportLevelDto,
  ): Promise<SupportLevelDocument> {
    const levelUpdate = await this.repository.findByIdAndUpdate(
      id,
      updateSupportLevelDto,
      {
        new: true,
      },
    );

    if (!levelUpdate) {
      throw new NotFoundException(SupportLevelsErrors.NOT_FOUND);
    }

    return levelUpdate;
  }

  async remove(id: string): Promise<SupportLevelDocument> {
    const levelDeleted = await this.repository.findByIdAndDelete(id);

    if (!levelDeleted) {
      throw new NotFoundException(SupportLevelsErrors.NOT_FOUND);
    }

    return levelDeleted;
  }

  checkStatus(level: SupportLevelDocument): void {
    if (level.status === Status.DELETED) {
      throw new NotFoundException(SupportLevelsErrors.DELETE);
    }

    if (level.status === Status.INACTIVE) {
      throw new NotFoundException(SupportLevelsErrors.INACTIVE);
    }
  }
}
