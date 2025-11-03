import { IsOptional, IsString } from 'class-validator';

export class MediaEvidenceDto {
  /**
   * Name of the file
   */
  @IsOptional()
  @IsString()
  nameFile?: string;

  /**
   * URL of the file
   */
  @IsOptional()
  @IsString()
  url?: string;
}
