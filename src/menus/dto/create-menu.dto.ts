import { IsEnum, IsJSON, IsNumber, IsOptional, Length } from 'class-validator';
import { EStatus } from 'src/common/types/enum';

export class CreateMenuDto {
  @Length(1, 128)
  title: string;

  @Length(1, 128)
  routerName: string;

  @IsJSON()
  @IsOptional()
  query: string;

  @IsEnum(EStatus)
  @IsOptional()
  status = EStatus.enabled;

  @IsNumber()
  @IsOptional()
  parentMenu = -1;

  @IsNumber()
  projectId: number;
}
