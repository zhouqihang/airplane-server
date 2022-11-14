import { PartialType } from '@nestjs/mapped-types';
import { CreatePageConfigDto } from './create-page-config.dto';

export class UpdatePageConfigDto extends PartialType(CreatePageConfigDto) {}
