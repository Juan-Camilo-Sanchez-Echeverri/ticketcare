import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import type { PaginateModel } from 'mongoose';

import { EntityRepository } from '@common/database/entity.repository';

import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersRepository extends EntityRepository<UserDocument> {
  constructor(
    @InjectModel(User.name)
    protected readonly userModel: PaginateModel<UserDocument>,
  ) {
    super(userModel);
  }
}
