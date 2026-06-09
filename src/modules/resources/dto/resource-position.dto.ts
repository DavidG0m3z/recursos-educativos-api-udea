import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { Participation } from '../../../common/enums/participation.enum';

export class ResourcePositionDto {

  @IsInt()
  @IsNotEmpty()
  positionId!: number;

  @IsEnum(Participation)
  @IsNotEmpty()
  participation!: Participation;
}