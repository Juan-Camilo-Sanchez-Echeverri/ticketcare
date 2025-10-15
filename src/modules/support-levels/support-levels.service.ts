import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, type PaginateModel, PaginateResult } from 'mongoose';

import { FilterDto } from '@common/dto';
import { Status } from '@common/enums';

import { CreateSupportLevelDto, UpdateSupportLevelDto } from './dto';

import {
  SupportLevel,
  SupportLevelDocument,
} from './schemas/support-level.schema';

import {
  DELETE_SUPPORT_LEVEL,
  INACTIVE_SUPPORT_LEVEL,
  LEVEL_NAME_EXIST,
  NOT_EXIST_SUPPORT_LEVEL,
} from './constants';

@Injectable()
export class SupportLevelsService {
  constructor(
    @InjectModel(SupportLevel.name)
    private supportLevelModel: PaginateModel<SupportLevel>,
  ) {}

  async findOneById(id: string): Promise<SupportLevelDocument> {
    const supportLevel = await this.supportLevelModel.findById(id);

    if (!supportLevel) throw new NotFoundException(NOT_EXIST_SUPPORT_LEVEL);

    return await this.populateLevel(supportLevel);
  }

  async findOneByQuery(
    query: FilterQuery<SupportLevelDocument>,
  ): Promise<SupportLevelDocument | null> {
    const level = await this.supportLevelModel.findOne(query);

    return level ? await this.populateLevel(level) : null;
  }

  async findPaginate(
    filterDto: FilterDto<SupportLevelDocument>,
  ): Promise<PaginateResult<SupportLevelDocument>> {
    const { data, limit, page } = filterDto;

    return await this.supportLevelModel.paginate(data, { page, limit });
  }

  async findByQuery(
    query: FilterQuery<SupportLevelDocument>,
  ): Promise<SupportLevelDocument[]> {
    const levels = await this.supportLevelModel.find(query);
    return await Promise.all(levels.map((level) => this.populateLevel(level)));
  }

  async create(
    createSupportLevelDto: CreateSupportLevelDto,
  ): Promise<SupportLevelDocument> {
    await this.validateName(createSupportLevelDto, null);

    const newLevel = await this.supportLevelModel.create(createSupportLevelDto);

    return await this.populateLevel(newLevel);
  }

  async update(
    id: string,
    updateSupportLevelDto: UpdateSupportLevelDto,
  ): Promise<SupportLevelDocument> {
    await this.validateName(updateSupportLevelDto, id);

    const levelUpdate = await this.supportLevelModel.findByIdAndUpdate(
      id,
      updateSupportLevelDto,
      {
        new: true,
      },
    );

    if (!levelUpdate) throw new NotFoundException(NOT_EXIST_SUPPORT_LEVEL);

    return await this.populateLevel(levelUpdate);
  }

  async remove(id: string): Promise<SupportLevelDocument> {
    const levelDeleted = await this.supportLevelModel.findByIdAndUpdate(
      id,
      { status: Status.DELETED },
      {
        new: true,
      },
    );

    if (!levelDeleted) throw new NotFoundException(NOT_EXIST_SUPPORT_LEVEL);

    return await this.populateLevel(levelDeleted);
  }

  checkStatus(level: SupportLevelDocument): void {
    if (level.status === Status.DELETED) {
      throw new NotFoundException(DELETE_SUPPORT_LEVEL);
    }

    if (level.status === Status.INACTIVE) {
      throw new NotFoundException(INACTIVE_SUPPORT_LEVEL);
    }
  }

  private async populateLevel(
    level: SupportLevelDocument,
  ): Promise<SupportLevelDocument> {
    const match = { status: Status.ACTIVE };

    return await level.populate([
      { path: 'businessContractor', select: 'name', match },
      { path: 'modifiedBy', select: 'name lastName role', match },
    ]);
  }

  /**
   * * Private methods
   */

  private async validateName(
    dto: UpdateSupportLevelDto,
    levelId: string | null,
  ): Promise<void> {
    const { name, businessContractor } = dto;

    const level = await this.findOneByQuery({
      name,
      _id: { $ne: levelId },
      businessContractor,
      status: Status.ACTIVE,
    });

    if (level) throw new BadRequestException(LEVEL_NAME_EXIST);
  }
}
