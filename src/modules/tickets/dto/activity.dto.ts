import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { Allow, IsNotEmpty, IsOptional } from 'class-validator';

import { TypeContent, StatusTicket } from '../enums';

export class ContentDto {
  @Allow()
  @ApiHideProperty()
  type?: TypeContent;

  @Allow()
  @ApiHideProperty()
  message: string;

  @IsOptional()
  urls?: string[];
}

export class ActivityDto {
  @Allow()
  @ApiHideProperty()
  content: ContentDto;

  @IsNotEmpty()
  message: string;

  @Allow()
  @ApiHideProperty()
  user: string;

  @Allow()
  @ApiHideProperty()
  status: StatusTicket;

  @Allow()
  @ApiProperty({ type: 'array', items: { type: 'file', format: 'binary' } })
  files?: Express.Multer.File[];

  @Allow()
  @ApiHideProperty()
  contractorId: string;
}
