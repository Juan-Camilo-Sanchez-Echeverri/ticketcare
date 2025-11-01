import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import {
  Allow,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

import { TypeContent, StatusTicket } from '../enums';

class ContentDto {
  @ApiHideProperty()
  type?: TypeContent;

  @IsNotEmpty()
  message: string;

  @IsOptional()
  urls?: string[];
}

export class ActivityDto {
  @Type(() => ContentDto)
  @ValidateNested({ each: true })
  content: ContentDto;

  @ApiHideProperty()
  user: string;

  @ApiHideProperty()
  @IsEnum(StatusTicket)
  status: StatusTicket;

  @Allow()
  @ApiProperty({ type: 'array', items: { type: 'file', format: 'binary' } })
  files?: Express.Multer.File[];

  @ApiHideProperty()
  contractorId: string;
}
