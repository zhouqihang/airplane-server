import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { EProjectStatus } from '../types';

export class SearchProjectDto extends PaginationDto {
  @IsOptional()
  name = '';

  @IsOptional()
  desc = '';

  @IsEnum(EProjectStatus)
  @IsOptional()
  status: EProjectStatus;
}
