import { Injectable, NotFoundException } from '@nestjs/common';

import { PaginateResult, PopulateOptions } from 'mongoose';

import { Status } from '@common/enums';

import {
  CreateBusinessClientDto,
  FilterBusinessClientDto,
  UpdateBusinessClientDto,
} from './dto';

import { NOT_EXIST_BUSINESS_CLIENT } from './constants';

import { BusinessClientsRepository } from './repositories/business-clients.repository';

import { BusinessClientDocument } from './schemas/business-client.schema';

@Injectable()
export class BusinessClientsService {
  private readonly match = { status: Status.ACTIVE };

  private readonly pathsPopulate: PopulateOptions[] = [
    { path: 'businessContractors', select: 'name', match: this.match },
  ];

  constructor(
    private readonly businessClientsRepository: BusinessClientsRepository,
  ) {}

  async findOneById(id: string): Promise<BusinessClientDocument> {
    const businessClient = await this.businessClientsRepository.findOneById(id);

    if (!businessClient) throw new NotFoundException(NOT_EXIST_BUSINESS_CLIENT);

    return this.populateClient(businessClient);
  }

  async findPaginate(
    filterDto: FilterBusinessClientDto,
  ): Promise<PaginateResult<BusinessClientDocument>> {
    return await this.businessClientsRepository.findPaginate(filterDto, {
      populate: this.pathsPopulate,
    });
  }

  async create(
    createBusinessClientDto: CreateBusinessClientDto,
  ): Promise<BusinessClientDocument> {
    const newClient = await this.businessClientsRepository.create(
      createBusinessClientDto,
    );

    return this.populateClient(newClient);
  }

  async update(
    id: string,
    updateBusinessClientDto: UpdateBusinessClientDto,
  ): Promise<BusinessClientDocument> {
    const clientUpdate = await this.businessClientsRepository.findByIdAndUpdate(
      id,
      updateBusinessClientDto,
    );

    if (!clientUpdate) throw new NotFoundException(NOT_EXIST_BUSINESS_CLIENT);

    return this.populateClient(clientUpdate);
  }

  async remove(id: string): Promise<BusinessClientDocument> {
    const clienteDeleted =
      await this.businessClientsRepository.findByIdAndDelete(id);

    if (!clienteDeleted) throw new NotFoundException(NOT_EXIST_BUSINESS_CLIENT);

    return clienteDeleted;
  }

  /**
   * * Private methods
   */

  private populateClient(
    client: BusinessClientDocument,
  ): Promise<BusinessClientDocument> {
    return client.populate(this.pathsPopulate);
  }
}
