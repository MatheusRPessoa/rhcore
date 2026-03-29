import { ApiProperty } from '@nestjs/swagger';

export class ErrorDetailsDto {
  @ApiProperty({ description: 'Mensagem de erro', example: 'Dados inválidos' })
  message: string;

  @ApiProperty({ description: 'Tipo do erro', example: 'Bad Request' })
  error: string;

  @ApiProperty({ description: 'Código de status HTTP', example: 400 })
  statusCode: number;
}

export class BadRequestResponseDto {
  @ApiProperty({ example: false })
  succeeded: boolean;

  @ApiProperty({ example: null, nullable: true })
  data: unknown;

  @ApiProperty({ example: 'Dados inválidos' })
  message: string;

  @ApiProperty({ type: ErrorDetailsDto })
  error: ErrorDetailsDto;
}

export class UnauthorizedResponseDto {
  @ApiProperty({ example: false })
  succeeded: boolean;

  @ApiProperty({ example: null, nullable: true })
  data: unknown;

  @ApiProperty({
    example: 'Token de sessão não encontrado ou sessão inválida/expirada.',
  })
  message: string;

  @ApiProperty({ type: ErrorDetailsDto })
  error: ErrorDetailsDto;
}

export class NotFoundResponseDto {
  @ApiProperty({ example: false })
  succeeded: boolean;

  @ApiProperty({ example: null, nullable: true })
  data: unknown;

  @ApiProperty({ example: 'Recurso não encontrado.' })
  message: string;

  @ApiProperty({ type: ErrorDetailsDto })
  error: ErrorDetailsDto;
}

export class ConflictResponseDto {
  @ApiProperty({ example: false })
  succeeded: boolean;

  @ApiProperty({ example: null, nullable: true })
  data: unknown;

  @ApiProperty({ example: 'Conflito ao realizar a operação.' })
  message: string;

  @ApiProperty({ type: ErrorDetailsDto })
  error: ErrorDetailsDto;
}
