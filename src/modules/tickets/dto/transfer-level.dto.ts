import { ApiHideProperty } from '@nestjs/swagger';

import { Allow, IsMongoId, IsNotEmpty } from 'class-validator';

import type { SupportLevelDocument } from '@modules/support-levels/schemas/support-level.schema';
import type { TicketDocument } from '../schemas';

export class TransferLevelDto {
  @IsNotEmpty()
  @IsMongoId()
  supportLevel: string;

  @Allow()
  @ApiHideProperty()
  levelInfo: SupportLevelDocument;

  @Allow()
  @ApiHideProperty()
  ticket: TicketDocument;

  @Allow()
  @ApiHideProperty()
  unsetAssignedUser: boolean;
}
