import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class SearchPageDto extends PaginationDto {
  @IsOptional()
  @IsString()
  pageName: string;

  @IsString()
  @IsOptional()
  status: unknown;

  @IsOptional()
  @IsString()
  menu = '';
}
