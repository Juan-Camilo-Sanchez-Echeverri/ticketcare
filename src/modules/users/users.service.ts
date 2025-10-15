import { Injectable, NotFoundException } from '@nestjs/common';

import { hash } from 'bcrypt';

import { PaginateResult, PopulateOptions } from 'mongoose';

import { ICrudService } from '@common/interfaces';

import { Status } from '@common/enums';

import { CreateUserDto, FilterUsersDto, UpdateUserDto } from './dto';

import { UsersRepository } from './repositories/users.repository';

import { UsersErrors } from './errors/users.errors';

import { UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService implements ICrudService<UserDocument> {
  private readonly pathsPopulate: PopulateOptions[] = [
    { path: 'modifiedBy', select: 'name lastName role' },
    { path: 'details.supportDepartments', select: 'name' },
    { path: 'details.supportLevels', select: 'name' },
    { path: 'details.businessContractors', select: 'name' },
    { path: 'details.businessClients', select: 'name' },
  ];

  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const hashedPassword = await hash(createUserDto.password, 10);

    const newUser = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.populateUser(newUser);
  }

  async findPaginate(
    filter: FilterUsersDto,
  ): Promise<PaginateResult<UserDocument>> {
    return await this.usersRepository.findPaginate(filter, {
      populate: this.pathsPopulate,
    });
  }

  async findOneById(id: string): Promise<UserDocument> {
    const user = await this.usersRepository.findOne({
      _id: id,
      status: Status.ACTIVE,
    });

    if (!user) throw new NotFoundException(UsersErrors.NOT_FOUND);

    return this.populateUser(user);
  }

  async findOneByQuery(
    query: FilterUsersDto['data'],
  ): Promise<UserDocument | null> {
    return await this.usersRepository.findOne(query);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    if (updateUserDto.password) {
      updateUserDto.password = await hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.usersRepository.findOneAndUpdate(
      { _id: id, status: Status.ACTIVE },
      updateUserDto,
    );

    if (!updatedUser) throw new NotFoundException(UsersErrors.NOT_FOUND);

    return this.populateUser(updatedUser);
  }

  async remove(id: string): Promise<UserDocument> {
    const deletedUser = await this.usersRepository.findOneAndDelete({
      _id: id,
      status: Status.ACTIVE,
    });

    if (!deletedUser) throw new NotFoundException(UsersErrors.NOT_FOUND);

    return deletedUser;
  }

  private async populateUser(doc: UserDocument): Promise<UserDocument> {
    return doc.populate(this.pathsPopulate);
  }
}
