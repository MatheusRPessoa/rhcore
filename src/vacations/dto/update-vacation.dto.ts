import { PartialType } from '@nestjs/mapped-types';
import { CreateVacationDto } from './create-vacation.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { VacationStatusEnum } from '../enums/vacation-status.enum';

export class UpdateVacationDto {
  @ApiPropertyOptional({ example: '2025-07-25' })
  @IsDateString({}, { message: 'A data de início deve ser uma data válida' })
  @IsOptional()
  DATA_INICIO?: string;

  @ApiPropertyOptional({ example: '2025-07-05' })
  @IsDateString({}, { message: 'A data de fim deve ser uma data válida' })
  @IsOptional()
  DATA_FIM?: string;

  @ApiPropertyOptional({
    enum: VacationStatusEnum,
    example: VacationStatusEnum.APROVADO,
  })
  @IsEnum(VacationStatusEnum, { message: 'Status de férias inválido' })
  @IsOptional()
  STATUS_FERIAS?: VacationStatusEnum;

  @ApiPropertyOptional({ example: 'Aprovado pela gestão' })
  @IsString({ message: 'A observação deve ser do tipo texto' })
  @IsOptional()
  @MaxLength(500, { message: 'A observação deve ter no máximo 500 caracteres' })
  OBSERVACAO?: string;

  @ApiPropertyOptional({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  @IsUUID('4', { message: 'O ID do aprovador deve ser um UUID válido' })
  @IsOptional()
  APROVADO_POR_ID?: string;

  @ApiPropertyOptional({ example: '2025-06-15' })
  @IsDateString({}, { message: 'A data de aprovação deve ser uma data válida' })
  @IsOptional()
  DATA_APROVACAO?: string;
}
