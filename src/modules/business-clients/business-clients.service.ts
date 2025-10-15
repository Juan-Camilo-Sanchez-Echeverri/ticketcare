import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, type PaginateModel, PaginateResult } from 'mongoose';

import { BUSINESS_EXISTS } from '@common/constants';
import { Status } from '@common/enums';

import {
  CreateBusinessClientDto,
  PaginationClientDto,
  UpdateBusinessClientDto,
} from './dto';

import {
  BusinessClient,
  BusinessClientDocument,
} from './schemas/business-client.schema';

import {
  DELETE_BUSINESS_CLIENT,
  INACTIVE_BUSINESS_CLIENT,
  NOT_EXIST_BUSINESS_CLIENT,
} from './constants';

@Injectable()
export class BusinessClientsService {
  constructor(
    @InjectModel(BusinessClient.name)
    private businessClientModel: PaginateModel<BusinessClient>,
  ) {}

  async findOneById(
    id: BusinessClientDocument['id'],
  ): Promise<BusinessClientDocument> {
    const businessClient = await this.businessClientModel.findById(id);

    if (!businessClient) throw new NotFoundException(NOT_EXIST_BUSINESS_CLIENT);

    return this.populateClient(businessClient);
  }

  async findPaginate(
    filterDto: PaginationClientDto,
  ): Promise<PaginateResult<BusinessClientDocument>> {
    const { data, page, limit } = filterDto;
    return await this.businessClientModel.paginate(data, {
      page,
      limit,
    });
  }

  async create(
    createBusinessClientDto: CreateBusinessClientDto,
  ): Promise<BusinessClientDocument> {
    await this.validateActiveClient(createBusinessClientDto, null);
    const newClient = await this.businessClientModel.create(
      createBusinessClientDto,
    );

    return this.populateClient(newClient);
  }

  async update(
    id: BusinessClientDocument['id'],
    updateBusinessClientDto: UpdateBusinessClientDto,
  ): Promise<BusinessClientDocument> {
    await this.validateActiveClient(updateBusinessClientDto, id);

    const clientUpdate = await this.businessClientModel.findByIdAndUpdate(
      id,
      updateBusinessClientDto,
      { new: true },
    );

    if (!clientUpdate) throw new NotFoundException(NOT_EXIST_BUSINESS_CLIENT);

    return this.populateClient(clientUpdate);
  }

  async remove(id: string): Promise<BusinessClientDocument> {
    const clienteDeleted = await this.businessClientModel.findByIdAndUpdate(
      id,
      { status: Status.DELETED },
      { new: true },
    );

    if (!clienteDeleted) throw new NotFoundException(NOT_EXIST_BUSINESS_CLIENT);

    return clienteDeleted;
  }

  checkStatusClient(client: BusinessClientDocument): void {
    if (client.status === Status.DELETED) {
      throw new NotFoundException(DELETE_BUSINESS_CLIENT);
    }

    if (client.status === Status.INACTIVE) {
      throw new NotFoundException(INACTIVE_BUSINESS_CLIENT);
    }
  }

  /**
   * * Private methods
   */

  private populateClient(
    client: BusinessClientDocument,
  ): Promise<BusinessClientDocument> {
    const match = { status: Status.ACTIVE };
    return client.populate([
      { path: 'businessContractors', match },
      { path: 'modifiedBy', select: 'name lastName role', match },
    ]);
  }

  private async validateActiveClient(
    data: UpdateBusinessClientDto,
    clientId: string | null,
  ): Promise<void> {
    const fieldsUniques = ['name', 'document', 'phone', 'email'];

    const filteredFields = fieldsUniques.filter(
      (field) => data[field as keyof UpdateBusinessClientDto],
    );

    const queries = filteredFields.map((field) =>
      this.checkFieldsUnique(field, data, clientId),
    );

    await Promise.all(queries);
  }

  private async checkFieldsUnique(
    field: string,
    data: UpdateBusinessClientDto,
    clientId: string | null,
  ): Promise<void> {
    const query: FilterQuery<BusinessClientDocument> = {
      status: Status.ACTIVE,
    };

    if (clientId !== null) query._id = { $ne: clientId };

    query[field] = data[field as keyof UpdateBusinessClientDto];

    const client = await this.businessClientModel.findOne(query);

    if (client) throw new NotFoundException(BUSINESS_EXISTS(field));
  }
}
