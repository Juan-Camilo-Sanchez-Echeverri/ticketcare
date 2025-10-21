import { Injectable, PipeTransform } from '@nestjs/common';

import { FilterBusinessClientDto } from '../dto';

@Injectable()
export class FilterBusinessClientPipe implements PipeTransform {
  transform(value: FilterBusinessClientDto): FilterBusinessClientDto {
    const { contractor } = value;

    if (contractor) {
      value.data.businessContractors = { $elemMatch: { $eq: contractor } };
    }

    return value;
  }
}
