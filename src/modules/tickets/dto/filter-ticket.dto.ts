import { FilterDto } from '@common/dto';

import { TicketDocument } from '../schemas';

export class FilterTicketDto extends FilterDto<TicketDocument> {}
