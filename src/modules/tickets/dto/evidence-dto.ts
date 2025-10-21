import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { UpdateTicketDto } from './update-ticket.dto';
import { MediaEvidenceDto } from './media-evidence.dto';

export class EvidenceDto extends UpdateTicketDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  url?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  user?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  password?: string;

  @IsArray()
  @IsOptional()
  files?: Express.Multer.File[];

  contractorId?: string;

  multimedia?: MediaEvidenceDto[];
}
