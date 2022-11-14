import {
  IsJSON,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';
import {
  IsVersion,
  VersionCodeValidator,
} from 'src/common/decorators/version.validator';

export class CreatePageConfigDto {
  // @Validate(VersionCodeValidator)
  @IsVersion()
  @MaxLength(64)
  version: string;

  @IsNumber()
  pageId: number;

  @IsJSON()
  jsonConfig: string;
}
