import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { RequestTypeEnum } from '../enums/request-type.enum';

export class CreateRequestDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  @IsUUID('4', { message: 'O ID do funcionário deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O ID do funcionário é obrigatório' })
  FUNCIONARIO_ID: string;

  @ApiProperty({ enum: RequestTypeEnum, example: RequestTypeEnum.BENEFICIO })
  @IsEnum(RequestTypeEnum, { message: 'Tipo de solicitação inválido' })
  @IsNotEmpty({ message: 'O tipo da solicitação é obrigatória' })
  TIPO: RequestTypeEnum;

  @ApiProperty({ example: 'Solicitação de declaração de vínculo empregatício' })
  @IsString({ message: 'A descrição deve ser do tipo texto' })
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @MaxLength(500, { message: 'A descrição deve ter no máximo 500 caracteres' })
  DESCRICAO: string;

  @ApiProperty({ example: '2025-07-01' })
  @IsDateString(
    {},
    { message: 'A data da solicitação deve ser uma data válida' },
  )
  @IsNotEmpty({ message: 'A data da solicitação é obrigatória' })
  DATA_SOLICITACAO: string;

  @ApiPropertyOptional({ example: 'Urgente para processo bancário' })
  @IsString({ message: 'A observação deve ser do tipo texto' })
  @IsOptional()
  @MaxLength(500, { message: 'A observação deve ter no máximo 500 caracteres' })
  OBSERVACAO?: string;
}
