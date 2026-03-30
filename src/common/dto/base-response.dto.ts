import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export abstract class BaseSuccessResponseDto {
  @ApiProperty({ description: 'Indica sucesso da operação', example: true })
  succeeded: boolean;

  @ApiPropertyOptional({ description: 'Mensagem adicional' })
  message?: string;
}

export class SuccessMessageResponseDto {
  @ApiProperty({ example: true })
  succeeded: boolean;

  @ApiProperty({ description: 'Mensagem informativa' })
  message: string;
}
