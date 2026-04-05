import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateVacationDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  @IsUUID('4', { message: 'O ID do funcionário deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O ID do funcionário é obrigatório' })
  FUNCIONARIO_ID: string;

  @ApiProperty({ example: '2025-07-30' })
  @IsDateString({}, { message: 'A data de inicio deve ser uma data válida' })
  @IsNotEmpty({ message: 'A data de inicio é obrigatória' })
  DATA_INICIO: string;

  @ApiProperty({ example: '2025-07-30' })
  @IsDateString({}, { message: 'A data de fim deve ser uma da válida' })
  @IsNotEmpty({ message: 'A data de fim é obrigatória' })
  DATA_FIM: string;

  @ApiPropertyOptional({ example: 'Férias programadas do segundo semestre' })
  @IsString({ message: 'A observação deve ser do tipo texto' })
  @IsOptional()
  @MaxLength(500, { message: 'A observação deve ter ' })
  OBSERVACAO?: string;
}
