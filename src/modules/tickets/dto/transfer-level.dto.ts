import { ApiHideProperty } from '@nestjs/swagger';

import { IsMongoId, IsNotEmpty } from 'class-validator';

import type { SupportLevelDocument } from '@modules/support-levels/schemas/support-level.schema';
import type { TicketDocument } from '../schemas';

export class TransferLevelDto {
  @IsNotEmpty()
  @IsMongoId()
  supportLevel: string;

  @ApiHideProperty()
  levelInfo: SupportLevelDocument;

  @ApiHideProperty()
  ticket: TicketDocument;

  @ApiHideProperty()
  unsetAssignedUser: boolean;
}
