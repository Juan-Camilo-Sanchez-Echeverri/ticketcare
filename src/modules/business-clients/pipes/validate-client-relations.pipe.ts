import { Injectable, PipeTransform } from '@nestjs/common';

import { BusinessContractorsService } from '../../business-contractors/business-contractors.service';

import { UpdateBusinessClientDto } from '../dto';

@Injectable()
export class ValidateClientRelationsPipe implements PipeTransform {
  constructor(
    private readonly contractorsService: BusinessContractorsService,
  ) {}
  async transform(value: UpdateBusinessClientDto) {
    const { businessContractors = [] } = value;

    const promises = [];

    for (const contractorId of businessContractors) {
      promises.push(this.contractorsService.findOneById(contractorId));
    }

    await Promise.all(promises);

    return value;
  }
}
