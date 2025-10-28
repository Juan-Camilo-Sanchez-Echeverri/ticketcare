import type { Request } from 'express';

import { REQUEST } from '@nestjs/core';

import { Inject, Injectable, PipeTransform } from '@nestjs/common';

import {
  diacriticSensitiveRegex,
  extractUserFromRequest,
} from '@common/helpers';

import { FilterBusinessContractorDto } from '../dto';
import { Status, UserRole } from '../../../common/enums';

@Injectable()
export class FilterBusinessContractorPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: Request) {}
  transform(value: FilterBusinessContractorDto) {
    const name = String(value.data.name || '').trim();

    const user = extractUserFromRequest(this.request);

    if (user.role !== UserRole.SuperUser) value.data.status = Status.ACTIVE;

    if (name) {
      const diacriticRegex = diacriticSensitiveRegex(name);
      const regex = new RegExp(diacriticRegex, 'i');
      value.data.name = regex;
    }

    return value;
  }
}
