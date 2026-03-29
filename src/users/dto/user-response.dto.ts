import { ApiProperty } from '@nestjs/swagger';
import { BaseSuccessResponseDto } from 'src/common/dto/base-response.dto';

export class UserDataDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  ID: string;

  @ApiProperty({ example: 'joao.silva' })
  NOME_USUARIO: string;

  @ApiProperty({ example: 'joao@email.com' })
  EMAIL: string;

  @ApiProperty({ example: 'ATIVO' })
  STATUS: string;

  @ApiProperty({ example: 'admin' })
  CRIADO_POR: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  CRIADO_EM: Date;
}

export class UserResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: UserDataDto })
  data: UserDataDto;
}

export class UserListResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: [UserDataDto] })
  data: UserDataDto[];
}
