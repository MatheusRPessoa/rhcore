import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'joao.silva' })
  @IsString({ message: 'O username deve ser do tipo texto' })
  @IsNotEmpty({ message: 'O username é obrigatório' })
  @MinLength(3, { message: 'O username deve ter no mínimo 3 caracteres' })
  @MaxLength(50, { message: 'O username deve ter no máximo 50 caracteres' })
  username: string;

  @ApiProperty({ example: 'admin123' })
  @IsString({ message: 'A senha deve ser do tipo texto' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;
}
