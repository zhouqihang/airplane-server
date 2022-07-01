import { IntersectionType, OmitType, PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { EUserStatus } from '../types';
import { CreateUserDto } from './create-user.dto';

export class SearchUserDto extends IntersectionType(
  PaginationDto,
  PartialType(OmitType(CreateUserDto, ['password', 'status'])),
) {
  @IsOptional()
  @Type(() => Date)
  createTime: Date;

  status: EUserStatus | '' = '';
}
