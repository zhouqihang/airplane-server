import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ERole } from '../consts/role-enum';

export class UpdateUserProjectDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNotEmpty()
  userId: number;

  @IsEnum(ERole)
  role: ERole;
}
