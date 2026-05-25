import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ComplexityRefDto } from './complexity-ref.dto';

export class CreateResourceDto {

 @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsOptional()
  @IsBoolean()
  hidden?: boolean;

  // IDs de las categorías a asociar
  @IsOptional()
  @IsArray()
  categoryIds?: number[];

  // IDs de los cargos a asociar
  @IsOptional()
  @IsArray()
  positionIds?: number[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComplexityRefDto)
  complexityRefs?: ComplexityRefDto[];
}