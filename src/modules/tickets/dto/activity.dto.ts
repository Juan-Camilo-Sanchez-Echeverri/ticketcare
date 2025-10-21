import { TypeContent } from '../enums';
import { UpdateTicketDto } from './update-ticket.dto';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ContentDto {
  type?: TypeContent;

  @IsNotEmpty()
  message: string;

  @IsOptional()
  urls?: string[];
}

export class ActivityDto extends UpdateTicketDto {
  @Type(() => ContentDto)
  @ValidateNested({ each: true })
  content: ContentDto;

  user: string;

  @IsOptional()
  @IsArray()
  files?: Express.Multer.File[];

  contractorId: string;
}
