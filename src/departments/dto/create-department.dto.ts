import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({ example: 'Tecnologia da Informação' })
  @IsString({ message: 'o nome do departamento deve ser do tipo texto' })
  @IsNotEmpty({ message: 'O nome do departamento é obrigatório' })
  @MaxLength(100, {
    message: 'O nome do departamento deve ter no máximo 100 caracteres',
  })
  NOME: string;

  @ApiProperty({ example: 'TI' })
  @IsString({ message: 'O valor da sigla deve ser do tipo texto' })
  @IsNotEmpty({ message: 'A sigla é obrigatória' })
  @MinLength(2, { message: 'A sigla deve ter no mínimo 2 caracteres' })
  @MaxLength(10, { message: 'A sigla deve ter no máximo 10 caracteres' })
  SIGLA: string;

  @ApiPropertyOptional({ example: 'Departamento responsável pela TI' })
  @IsString({ message: 'O valor da descrição deve ser do tipo texto' })
  @IsOptional()
  @MaxLength(255, { message: 'A descrição deve ter no máximo 255 caracteres' })
  DESCRICAO?: string;

  @ApiPropertyOptional({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  @IsUUID('4', { message: 'O ID do departamento pai deve ser um UUID válido' })
  @IsOptional()
  DEPARTAMENTO_PAI_ID?: string;
}
