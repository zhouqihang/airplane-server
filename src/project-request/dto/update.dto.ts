import { IsBoolean, IsJSON, IsNumber, IsOptional } from 'class-validator';

export class UpdateDto {
  @IsJSON()
  @IsOptional()
  prefixs: string;
  @IsJSON()
  @IsOptional()
  domains: string;
  @IsBoolean()
  @IsOptional()
  isHttps: boolean;
  @IsOptional()
  @IsNumber()
  timeout: number;
}
