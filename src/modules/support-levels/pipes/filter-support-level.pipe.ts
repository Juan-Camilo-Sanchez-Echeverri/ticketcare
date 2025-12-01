import type { Request } from 'express';

import { REQUEST } from '@nestjs/core';

import { Inject, Injectable, PipeTransform } from '@nestjs/common';

import { Status, UserRole } from '@common/enums';

import {
  diacriticSensitiveRegex,
  extractUserFromRequest,
} from '@common/helpers';

import { FilterSupportLevelDto } from '../dto';

@Injectable()
export class FilterSupportLevelPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  transform(value: FilterSupportLevelDto): FilterSupportLevelDto {
    const name = String(value.data.name || '').trim();
    const description = String(value.data.description || '').trim();

    const user = extractUserFromRequest(this.request);

    if (user.role !== UserRole.SuperUser) value.data.status = Status.ACTIVE;

    const nameRegex = this.makeRegex(name);
    if (nameRegex) value.data.name = nameRegex;

    const descriptionRegex = this.makeRegex(description);
    if (descriptionRegex) value.data.description = descriptionRegex;

    return value;
  }

  private makeRegex(value?: string): RegExp | undefined {
    const v = String(value || '').trim();

    if (!v) return undefined;

    const diacriticRegex = diacriticSensitiveRegex(v);

    return new RegExp(diacriticRegex, 'i');
  }
}
