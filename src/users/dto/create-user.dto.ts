import { IsEmail, Length, IsEnum } from 'class-validator';
import { EUserStatus } from '../types';

export class CreateUserDto {
  @Length(1, 64)
  username: string;

  @Length(1, 16)
  account: string;

  @Length(1, 16)
  password: string;

  @IsEmail()
  @Length(1, 64)
  email: string;

  @IsEnum(EUserStatus)
  status: EUserStatus = EUserStatus.disabled;
}
