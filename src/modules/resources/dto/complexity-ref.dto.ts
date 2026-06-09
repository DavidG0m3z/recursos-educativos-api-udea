import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class ComplexityRefDto {
  @IsInt()
  level!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  link?: string;
}
