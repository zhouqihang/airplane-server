import { Type } from 'class-transformer';
import { IsEnum, IsJSON, IsNumber, IsOptional, Length } from 'class-validator';
import { EStatus } from 'src/common/types/enum';

export class CreateMenuDto {
  @Length(1, 128)
  title: string;

  @IsOptional()
  @IsJSON()
  query: string;

  @IsEnum(EStatus)
  @IsOptional()
  status = EStatus.enabled;

  @IsNumber()
  @IsOptional()
  parentMenu = -1;

  @IsOptional()
  @IsNumber()
  pageId: number;
}
