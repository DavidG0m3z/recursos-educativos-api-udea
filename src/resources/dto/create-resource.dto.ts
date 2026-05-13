import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ResourceRolesDto } from './resource-roles.dto';
import { ComplexityRefDto } from './complexity-ref.dto';

export class CreateResourceDto {
  @IsString()
  category: string;

  @IsString()
  type: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  hidden?: boolean;

  @ValidateNested()
  @Type(() => ResourceRolesDto)
  roles: ResourceRolesDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComplexityRefDto)
  complexity?: ComplexityRefDto[];
}