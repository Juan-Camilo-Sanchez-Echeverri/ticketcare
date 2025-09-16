import { PaginateResult } from 'mongoose';

import { FilterDto } from '../dto';

export interface ICrudService<T> {
  create(createDto: any): Promise<T>;
  findPaginate(
    filter: FilterDto<T>,
    cacheKey?: string,
  ): Promise<PaginateResult<T>>;

  findOneById(id: string): Promise<T | null>;
  update(id: string, updateDto: any): Promise<T | null>;
  remove(id: string): Promise<T | null>;
  populate?(document: T): Promise<T>;
}
