import { Injectable, NotFoundException } from '@nestjs/common';

import { PaginateResult } from 'mongoose';

import {
  CreateBusinessContractorDto,
  UpdateBusinessContractorDto,
  FilterBusinessContractorDto,
} from './dto';

import { BusinessContractorsRepository } from './repositories/business-contractors.repository';

import { BusinessContractorDocument } from './schemas/business-contractor.schema';

import { BusinessContractorsErrors } from './errors/business-contractors.errors';

@Injectable()
export class BusinessContractorsService {
  constructor(private readonly repository: BusinessContractorsRepository) {}

  async findOneById(id: string): Promise<BusinessContractorDocument> {
    const businessContractor = await this.repository.findOneById(id);

    if (!businessContractor) {
      throw new NotFoundException(BusinessContractorsErrors.NOT_FOUND);
    }

    return businessContractor;
  }

  async findOneByQuery(
    query: FilterBusinessContractorDto['data'],
  ): Promise<BusinessContractorDocument> {
    const businessContractor = await this.repository.findOne(query);

    if (!businessContractor) {
      throw new NotFoundException(BusinessContractorsErrors.NOT_FOUND);
    }

    return businessContractor;
  }

  async findPaginate(
    filter: FilterBusinessContractorDto,
  ): Promise<PaginateResult<BusinessContractorDocument>> {
    return await this.repository.findPaginate(filter);
  }

  async create(
    createBusinessContractorDto: CreateBusinessContractorDto,
  ): Promise<BusinessContractorDocument> {
    const newContractor = await this.repository.create(
      createBusinessContractorDto,
    );

    return newContractor;
  }

  async update(
    id: string,
    updateBusinessContractorDto: UpdateBusinessContractorDto,
  ): Promise<BusinessContractorDocument> {
    const contractorUpdate = await this.repository.findByIdAndUpdate(
      id,
      updateBusinessContractorDto,
      { new: true },
    );

    if (!contractorUpdate) {
      throw new NotFoundException(BusinessContractorsErrors.NOT_FOUND);
    }

    return contractorUpdate;
  }

  async remove(id: string): Promise<BusinessContractorDocument> {
    const contractor = await this.repository.findByIdAndDelete(id);

    if (!contractor) {
      throw new NotFoundException(BusinessContractorsErrors.NOT_FOUND);
    }

    return contractor;
  }
}
