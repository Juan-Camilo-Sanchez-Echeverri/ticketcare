import { IsOptional } from 'class-validator';

import type { FilterQuery } from 'mongoose';

import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { MediaEvidenceDto } from './media-evidence.dto';
import { TicketDocument } from '../schemas';

export class EvidenceDto {
  /**
   * URL of the evidence
   */
  @IsOptional()
  url?: string;

  /**
   * User for accessing the evidence
   */
  @IsOptional()
  user?: string;

  /**
   * Password for accessing the evidence
   */
  @IsOptional()
  password?: string;

  @ApiHideProperty()
  query?: FilterQuery<TicketDocument>;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  files?: string[];

  @ApiHideProperty()
  contractorId?: string;

  @ApiHideProperty()
  multimedia?: MediaEvidenceDto[];
}
