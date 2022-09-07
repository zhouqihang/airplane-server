import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class SearchMenuDto extends PaginationDto {
  @IsOptional()
  @IsString()
  title = '';

  @IsString()
  status: unknown = '';
}
