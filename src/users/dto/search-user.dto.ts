import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class SearchUserDto extends PaginationDto {
  @IsOptional()
  @IsString()
  username = '';

  @IsString()
  @Type(() => String)
  status = '';
}
