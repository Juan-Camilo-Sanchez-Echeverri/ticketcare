import type { Request } from 'express';

import { REQUEST } from '@nestjs/core';
import { Inject, Injectable, PipeTransform } from '@nestjs/common';

import { BaseDto } from '../dto';
import { extractUserFromRequest } from '../helpers';

@Injectable()
export class AddModifiedByPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: Request) {}
  transform(value: BaseDto): BaseDto {
    const user = extractUserFromRequest(this.request);

    if (user) value.modifiedBy = String(user._id);

    return value;
  }
}
