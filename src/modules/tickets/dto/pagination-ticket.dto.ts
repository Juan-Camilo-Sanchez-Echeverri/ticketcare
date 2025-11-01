import { FilterDto } from '@common/dto';

import { TicketDocument } from '../schemas';

export class PaginationTicketDto extends FilterDto<TicketDocument> {}
