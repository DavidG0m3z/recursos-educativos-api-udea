import { PartialType } from '@nestjs/mapped-types';
import { CreatePositionDto } from './create-position.dto';

export class UpdateCargoDto extends PartialType(CreatePositionDto) {}