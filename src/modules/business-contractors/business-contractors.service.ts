import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, type PaginateModel, PaginateResult } from 'mongoose';

import { BUSINESS_EXISTS } from '@common/constants/business.constants';

import { FilterDto } from '@common/dto';
import { Status } from '@common/enums';

import {
  CreateBusinessContractorDto,
  UpdateBusinessContractorDto,
} from './dto';

import {
  BusinessContractor,
  BusinessContractorDocument,
} from './schemas/business-contractor.schema';

import {
  DELETE_BUSINESS_CONTRACTOR,
  INACTIVE_BUSINESS_CONTRACTOR,
  NOT_EXIST_BUSINESS_CONTRACTOR,
} from './constants';

@Injectable()
export class BusinessContractorsService {
  constructor(
    @InjectModel(BusinessContractor.name)
    private businessContractorModel: PaginateModel<BusinessContractor>,
  ) {}

  async findOneById(id: string): Promise<BusinessContractorDocument> {
    const businessContractor = await this.businessContractorModel.findById(id);

    if (!businessContractor) {
      throw new NotFoundException(NOT_EXIST_BUSINESS_CONTRACTOR);
    }

    return await this.populateContractor(businessContractor);
  }

  async findOneByQuery(
    query: FilterQuery<BusinessContractorDocument>,
  ): Promise<BusinessContractorDocument> {
    const businessContractor =
      await this.businessContractorModel.findOne(query);

    if (!businessContractor) {
      throw new NotFoundException(NOT_EXIST_BUSINESS_CONTRACTOR);
    }

    return this.populateContractor(businessContractor);
  }

  async findPaginate(
    filterDto: FilterDto<BusinessContractorDocument>,
  ): Promise<PaginateResult<BusinessContractorDocument>> {
    const { data, page, limit } = filterDto;
    return await this.businessContractorModel.paginate(data, { page, limit });
  }

  async create(
    createBusinessContractorDto: CreateBusinessContractorDto,
  ): Promise<BusinessContractorDocument> {
    await this.validateActiveContractor(createBusinessContractorDto, null);
    const newContractor = await this.businessContractorModel.create(
      createBusinessContractorDto,
    );

    return this.populateContractor(newContractor);
  }

  async update(
    id: BusinessContractorDocument['id'],
    updateBusinessContractorDto: UpdateBusinessContractorDto,
  ): Promise<BusinessContractorDocument> {
    await this.validateActiveContractor(
      updateBusinessContractorDto,
      String(id),
    );

    const contractorUpdate =
      await this.businessContractorModel.findByIdAndUpdate(
        id,
        updateBusinessContractorDto,
        { new: true },
      );

    return this.populateContractor(contractorUpdate!);
  }

  async remove(id: string): Promise<BusinessContractorDocument> {
    const contractor = await this.businessContractorModel.findByIdAndUpdate(
      id,
      {
        status: Status.DELETED,
      },
      { new: true },
    );

    if (!contractor) {
      throw new NotFoundException(NOT_EXIST_BUSINESS_CONTRACTOR);
    }

    return contractor;
  }

  checkStatusContractor(contractor: BusinessContractorDocument): void {
    if (contractor.status === Status.DELETED) {
      throw new ForbiddenException(DELETE_BUSINESS_CONTRACTOR);
    }

    if (contractor.status === Status.INACTIVE) {
      throw new ForbiddenException(INACTIVE_BUSINESS_CONTRACTOR);
    }
  }

  private async populateContractor(
    contractor: BusinessContractorDocument,
  ): Promise<BusinessContractorDocument> {
    return contractor.populate([
      { path: 'modifiedBy', select: 'name lastName role' },
      { path: 'address.country', select: 'name code' },
      { path: 'address.state', select: 'name code' },
      { path: 'address.city', select: 'name code' },
    ]);
  }

  private async validateActiveContractor(
    data: UpdateBusinessContractorDto,
    contractorId: string | null,
  ): Promise<void> {
    const fieldUniques = ['name', 'document', 'phone', 'email'];

    const filteredFields = fieldUniques.filter(
      (field) => data[field as keyof UpdateBusinessContractorDto],
    );

    const queries = filteredFields.map((field) =>
      this.checkFieldsUnique(field, data, contractorId),
    );

    await Promise.all(queries);
  }

  private async checkFieldsUnique(
    field: string,
    data: UpdateBusinessContractorDto,
    contractorId: string | null,
  ): Promise<void> {
    const query: FilterQuery<BusinessContractorDocument> = {
      status: Status.ACTIVE,
    };

    if (contractorId !== null) query._id = { $ne: contractorId };

    query[field] = data[field as keyof UpdateBusinessContractorDto];

    const businessContractor =
      await this.businessContractorModel.findOne(query);

    if (businessContractor) {
      throw new BadRequestException(BUSINESS_EXISTS(field));
    }
  }
}
