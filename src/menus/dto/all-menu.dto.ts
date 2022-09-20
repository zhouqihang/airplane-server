import { IsNumberString, IsOptional } from 'class-validator';
import { EStatus } from 'src/common/types/enum';

export class AllMenuDto {
  @IsNumberString()
  @IsOptional()
  status: EStatus;

  @IsOptional()
  @IsNumberString()
  belongsTo: number;
}
