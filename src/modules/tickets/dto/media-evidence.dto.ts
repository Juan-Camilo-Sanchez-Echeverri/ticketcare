import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MediaEvidenceDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nameFile?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  url?: string;
}
