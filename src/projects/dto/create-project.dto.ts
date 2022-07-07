import { IsEnum, Length } from 'class-validator';
import { EProjectStatus } from '../types';

export class CreateProjectDto {
  @Length(1, 20)
  name: string;

  @Length(1, 80)
  desc: string;

  @IsEnum(EProjectStatus)
  status: EProjectStatus = EProjectStatus.enabled;
}
