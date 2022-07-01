import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @Type(() => Number)
  page = 1;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pageSize = 20;
}
