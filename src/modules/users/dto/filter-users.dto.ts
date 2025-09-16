import { FilterDto } from '@common/dto';

import { User } from '../schemas/user.schema';

export class FilterUsersDto extends FilterDto<User> {}
