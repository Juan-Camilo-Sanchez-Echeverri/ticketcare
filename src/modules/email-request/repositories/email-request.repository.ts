import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import type { PaginateModel } from 'mongoose';

import { EntityRepository } from '@common/database/entity.repository';

import {
  EmailRequest,
  EmailRequestDocument,
} from '../schemas/email-request.schema';

@Injectable()
export class EmailRequestRepository extends EntityRepository<EmailRequestDocument> {
  constructor(
    @InjectModel(EmailRequest.name)
    protected readonly emailRequestModel: PaginateModel<EmailRequestDocument>,
  ) {
    super(emailRequestModel);
  }
}
