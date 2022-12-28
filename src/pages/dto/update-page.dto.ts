import { IsEnum, IsOptional, Length } from 'class-validator';
import { EStatus } from 'src/common/types/enum';

export class UpdatePageDto {
  @Length(1, 128)
  @IsOptional()
  pageName: string;

  @Length(1, 128)
  pageRouter: string;

  @Length(1, 128)
  pagePath: string;

  @IsEnum(EStatus)
  @IsOptional()
  status: EStatus;
}
