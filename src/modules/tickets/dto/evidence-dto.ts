import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { Allow, IsOptional } from 'class-validator';

import { MediaEvidenceDto } from './media-evidence.dto';

export class EvidenceDto {
  /**
   * URL of the evidence
   */
  @IsOptional()
  @ApiProperty({ required: false })
  url?: string;

  /**
   * User for accessing the evidence
   */
  @IsOptional()
  @ApiProperty({ required: false })
  user?: string;

  /**
   * Password for accessing the evidence
   */
  @IsOptional()
  @ApiProperty({ required: false })
  password?: string;

  @Allow()
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  readonly files?: string[];

  @ApiHideProperty()
  contractorId?: string;

  @ApiHideProperty()
  multimedia?: MediaEvidenceDto[];
}
