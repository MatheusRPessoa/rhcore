import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'joao.silva' })
  @IsString({ message: 'O valor informado deve ser do tipo texto' })
  @IsNotEmpty({ message: 'O nome de usuário é obrigatório' })
  @MinLength(3, {
    message: 'O nome de usuário deve ter no mínimo 3 caracteres',
  })
  @MaxLength(50, {
    message: 'O nome de usuário deve ter no máximo 50 caracteres',
  })
  NOME_USUARIO: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  EMAIL: string;

  @ApiProperty({ example: 'admin123' })
  @IsString({ message: 'O valor informado deve ser do tipo texto' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  SENHA: string;
}
