import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  /**
   * The number of items to return per page.
   * Defaults to 10 if not provided.
   */
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit: number = 10;

  /**
   * The page number to return.
   * Defaults to 1 if not provided.
   */
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page: number = 1;
}
