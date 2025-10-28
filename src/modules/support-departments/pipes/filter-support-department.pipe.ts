import type { Request } from 'express';

import { REQUEST } from '@nestjs/core';

import { Inject, Injectable, PipeTransform } from '@nestjs/common';

import { Status, UserRole } from '@common/enums';

import {
  diacriticSensitiveRegex,
  extractUserFromRequest,
} from '@common/helpers';

import { FilterSupportDepartmentDto } from '../dto';

@Injectable()
export class FilterSupportDepartmentPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: Request) {}
  transform(value: FilterSupportDepartmentDto): FilterSupportDepartmentDto {
    const name = String(value.data.name || '').trim();
    const description = String(value.data.description || '').trim();

    const user = extractUserFromRequest(this.request);

    if (user.role !== UserRole.SuperUser) value.data.status = Status.ACTIVE;

    if (name) {
      const diacriticRegex = diacriticSensitiveRegex(name);
      const regex = new RegExp(diacriticRegex, 'i');
      value.data.name = regex;
    }

    if (description) {
      const diacriticRegex = diacriticSensitiveRegex(description);
      const regex = new RegExp(diacriticRegex, 'i');
      value.data.description = regex;
    }

    return value;
  }
}
