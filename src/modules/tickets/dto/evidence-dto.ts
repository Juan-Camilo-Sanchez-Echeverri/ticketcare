import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { MediaEvidenceDto } from './media-evidence.dto';

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

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  files?: string[];

  @ApiHideProperty()
  contractorId?: string;

  @ApiHideProperty()
  multimedia?: MediaEvidenceDto[];
}
