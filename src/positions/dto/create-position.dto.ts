import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreatePositionDto {
  @ApiProperty({ example: 'Desenvolvedor Junior' })
  @IsString({ message: 'O nome do cargo deve ser do tipo texto' })
  @IsNotEmpty({ message: 'O nome do cargo é obrigatório' })
  @MaxLength(100, {
    message: 'O nome do cargo deve ter no máximo 100 caracteres',
  })
  NOME: string;

  @ApiPropertyOptional({
    example: 'Responsável pelo desenvolvimento de sistemas',
  })
  @IsString({ message: 'A descrição deve ser do tipo texto' })
  @IsOptional()
  @MaxLength(255, {
    message: 'A descrição deve ter no máximo 255 caracteres',
  })
  DESCRICAO?: string;

  @ApiPropertyOptional({ example: 'Junior' })
  @IsString({ message: 'O nível deve ser do tipo texto' })
  @IsOptional()
  @MaxLength(50, { message: 'O nível deve ter no máximo 50 caracteres' })
  NIVEL?: string;

  @ApiPropertyOptional({ example: 8500.0 })
  @IsNumber({}, { message: 'O salário base deve ser um número' })
  @IsPositive({ message: 'O salário base deve ser um valor positivo' })
  @IsOptional()
  SALARIO_BASE?: number;

  @ApiPropertyOptional({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  @IsUUID('4', { message: 'O ID do departamento deve ser um UUID válido' })
  @IsOptional()
  DEPARTAMENTO_ID?: string;
}
