import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VacationStatusEnum } from '../enums/vacation-status.enum';
import { BaseSuccessResponseDto } from 'src/common/dto/base-response.dto';

export class VacationEmployeeDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  ID: string;

  @ApiProperty({ example: 'Joao da Silva' })
  NOME: string;

  @ApiProperty({ example: '2025001' })
  MATRICULA: string;
}

export class VacationDataDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  ID: string;

  @ApiProperty({ type: () => VacationEmployeeDto })
  FUNCIONARIO: VacationEmployeeDto;

  @ApiProperty({ example: '2025-07-01' })
  DATA_INICIO: Date;

  @ApiProperty({ example: '2025-07-01' })
  DATA_FIM: Date;

  @ApiProperty({ example: 29 })
  DIAS_SOLICITADOS: number;

  @ApiProperty({
    enum: VacationStatusEnum,
    example: VacationStatusEnum.PENDENTE,
  })
  STATUS_FERIAS: VacationStatusEnum;

  @ApiPropertyOptional({ example: 'Férias programadas do segundo semestre' })
  OBSERVACAO: string | null;

  @ApiPropertyOptional({ type: () => VacationEmployeeDto })
  APROVADO_POR: VacationEmployeeDto | null;

  @ApiPropertyOptional({ example: '2025-06-15' })
  DATA_APROVACAO: Date | null;

  @ApiProperty({ example: 'admin' })
  CRIADO_POR: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  CRIADO_EM: Date;
}

export class VacationResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: VacationDataDto })
  data: VacationDataDto;
}

export class VacationListResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: [VacationDataDto] })
  data: VacationDataDto[];
}
