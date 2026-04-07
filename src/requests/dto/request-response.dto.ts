import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RequestTypeEnum } from '../enums/request-type.enum';
import { BaseSuccessResponseDto } from 'src/common/dto/base-response.dto';

export class RequestEmployeeDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  ID: string;

  @ApiProperty({ example: 'Joao da Silva' })
  NOME: string;

  @ApiProperty({ example: '2025001' })
  MATRICULA: string;
}

export class RequestDataDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  ID: string;

  @ApiProperty({ type: () => RequestEmployeeDto })
  FUNCIONARIO: RequestEmployeeDto;

  @ApiProperty({ enum: RequestTypeEnum, example: RequestTypeEnum.DOCUMENTO })
  TIPO: RequestTypeEnum;

  @ApiProperty({ example: 'Solicitação de declaração de vínculo empregatício' })
  DESCRICAO: string;

  @ApiPropertyOptional({ example: 'Urgente para processo bancário' })
  OBSERVACAO: string | null;

  @ApiProperty({ example: '2025-07-01' })
  DATA_SOLICITACAO: Date;

  @ApiPropertyOptional({ example: '2025-07-15' })
  DATA_RESPOSTA: Date | null;

  @ApiPropertyOptional({ type: () => RequestEmployeeDto })
  APROVADO_POR: RequestEmployeeDto | null;

  @ApiProperty({ example: 'admin' })
  CRIADO_POR: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  CRIADO_EM: Date;
}

export class RequestResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: RequestDataDto })
  data: RequestDataDto;
}

export class RequestListResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: [RequestDataDto] })
  data: RequestDataDto[];
}
