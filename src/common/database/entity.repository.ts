import {
  AggregateOptions,
  Document,
  FilterQuery,
  PaginateModel,
  PaginateOptions,
  PaginateResult,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

import { FilterDto } from '../dto';

export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: PaginateModel<T>) {}

  async findOne(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return await this.entityModel.findOne(filter, projection, options).exec();
  }

  async findOneById(
    id: string,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return await this.entityModel.findById(id, projection, options).exec();
  }

  async find(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T[]> {
    return await this.entityModel.find(filter, projection, options).exec();
  }

  async findPaginate(
    filter: FilterDto<T>,
    options?: PaginateOptions,
  ): Promise<PaginateResult<T>> {
    const { data, limit, page } = filter;
    return await this.entityModel.paginate(data, {
      limit,
      page,
      ...options,
    });
  }

  async create(createDto: unknown): Promise<T> {
    return await this.entityModel.create(createDto);
  }

  async findOneAndUpdate(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return await this.entityModel
      .findOneAndUpdate(filter, update, { ...options, new: true })
      .exec();
  }

  async findByIdAndUpdate(
    id: string,
    update: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return await this.entityModel
      .findByIdAndUpdate(id, update, { ...options, new: true })
      .exec();
  }

  async findOneAndDelete(filter: FilterQuery<T>): Promise<T | null> {
    return await this.entityModel.findOneAndDelete(filter).exec();
  }

  async findByIdAndDelete(id: string): Promise<T | null> {
    return await this.entityModel.findByIdAndDelete(id).exec();
  }

  async deleteMany(filter: FilterQuery<T>): Promise<boolean> {
    const result = await this.entityModel.deleteMany(filter);
    return result.deletedCount >= 1;
  }

  async aggregate<R>(
    pipeline: PipelineStage[],
    options?: AggregateOptions,
  ): Promise<R[]> {
    return await this.entityModel.aggregate<R>(pipeline, { ...options }).exec();
  }
}
