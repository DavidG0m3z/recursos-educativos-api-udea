import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  // Mínimo 8 caracteres para la contraseña
  @IsString()
  @MinLength(8)
  password!: string;

  // ID del rol a asignar
  @IsInt()
  roleId!: number;
}
