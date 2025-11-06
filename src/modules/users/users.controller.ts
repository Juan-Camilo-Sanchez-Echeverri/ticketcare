import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  AllRoles,
  ApiAuthResponses,
  ApiCreatedResponseWrapper,
  ApiNoContentResponseWrapper,
  ApiNotFoundResponseWrapper,
  ApiOkResponseWrapper,
  Roles,
} from '@common/decorators';

import { PaginateResult } from 'mongoose';

import { CreateUserDto, UpdateUserDto, FilterUsersDto } from './dto';

import { UsersService } from './users.service';

import { UserDocument } from './schemas/user.schema';

import { UserResponse } from './responses/user.response';

import { UsersErrors } from './errors/users.errors';

@ApiBearerAuth()
@ApiAuthResponses()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a user
   *
   * @remarks this operation creates a new user with the provided data.
   */
  @Post()
  @Roles('SuperUser', 'Admin')
  @ApiCreatedResponseWrapper(UserResponse)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDocument> {
    return await this.usersService.create(createUserDto);
  }

  /**
   * List all users
   *
   * @remarks this operation returns a paginated list of users and allows filtering by role, grade, and institution.
   *
   */
  @Get()
  @AllRoles()
  @ApiOkResponseWrapper(UserResponse, { isArray: true })
  async findAll(
    @Query() filter: FilterUsersDto,
  ): Promise<PaginateResult<UserDocument>> {
    return await this.usersService.findPaginate(filter);
  }

  /**
   * Get an user by id
   *
   * @remarks this operation retrieves an user by its id.
   */
  @Get(':id')
  @Roles('SuperUser', 'Admin')
  @ApiNotFoundResponseWrapper(UsersErrors.NOT_FOUND)
  @ApiOkResponseWrapper(UserResponse, { isArray: false })
  async findOne(@Param('id') id: string): Promise<UserDocument> {
    return await this.usersService.findOneById(id);
  }

  /**
   * Update an user by id
   *
   *  @remarks this operation updates an user by its id with the provided data.
   */
  @Patch(':id')
  @AllRoles()
  @ApiNotFoundResponseWrapper(UsersErrors.NOT_FOUND)
  @ApiOkResponseWrapper(UserResponse, { isArray: false })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return await this.usersService.update(id, updateUserDto);
  }

  /**
   * Delete an user by id
   *
   * @remarks this operation performs a hard-delete by removing the user's record from the database.
   */
  @Delete(':id')
  @ApiNoContentResponseWrapper()
  @Roles('SuperUser', 'Admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNotFoundResponseWrapper(UsersErrors.NOT_FOUND)
  async remove(@Param('id') id: string): Promise<UserDocument> {
    return await this.usersService.remove(id);
  }
}
