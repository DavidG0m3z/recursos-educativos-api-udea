import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Participation } from '../../../common/enums/participation.enum';

export class CreatePositionDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  //@IsEnum(Participation)
  //@IsNotEmpty()
  //participation!: Participation;
}
