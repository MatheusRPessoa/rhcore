import { ApiPropertyOptional } from '@nestjs/swagger';
import { RequestTypeEnum } from '../enums/request-type.enum';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsPort,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class UpdateRequestDto {
  @ApiPropertyOptional({
    enum: RequestTypeEnum,
    example: RequestTypeEnum.OUTROS,
  })
  @IsEnum(RequestTypeEnum, { message: 'Tipo de solicitação inválido' })
  @IsOptional()
  TIPO?: RequestTypeEnum;

  @ApiPropertyOptional({ example: 'Solicitação atualizada' })
  @IsString({ message: 'A descrição deve ser do tipo texto' })
  @IsOptional()
  @MaxLength(500, { message: 'A descrição deve ter no máximo 500 caracteres' })
  DESCRICAO?: string;

  @ApiPropertyOptional({ example: 'Observacao atualizada.' })
  @IsString({ message: 'A observação deve ser do tipo texto' })
  @IsOptional()
  @MaxLength(500, { message: 'A observação deve ter no máximo 500 caracteres' })
  OBSERVACAO?: string;

  @ApiPropertyOptional({ example: '2025-07-15' })
  @IsDateString({}, { message: 'A data de resposta deve ser uma data válida' })
  @IsOptional()
  DATA_RESPOSTA?: string;

  @ApiPropertyOptional({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  @IsUUID('4', { message: 'O ID do aprovador deve ser um UUID válido' })
  @IsOptional()
  APROVADO_POR_ID?: string;
}
