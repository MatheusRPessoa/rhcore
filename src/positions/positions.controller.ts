import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ConflictException,
  Req,
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  PositionListResponseDto,
  PositionResponseDto,
} from './dto/position-response.dto';
import {
  BadRequestResponseDto,
  NotFoundResponseDto,
  UnauthorizedResponseDto,
} from 'src/common/dto/error-response.dto';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { SuccessMessageResponseDto } from 'src/common/dto/base-response.dto';

@ApiTags('Cargos')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar cargo' })
  @ApiResponse({ status: 201, type: PositionResponseDto })
  @ApiResponse({ status: 400, type: BadRequestResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
  @ApiResponse({ status: 409, type: ConflictException })
  async create(
    @Body() dto: CreatePositionDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<PositionResponseDto> {
    const position = await this.positionsService.create(dto, req.user.username);
    return {
      succeeded: true,
      data: position,
      message: 'Cargo criado com sucesso.',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar cargos' })
  @ApiResponse({ status: 200, type: PositionListResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
  async findAll(): Promise<PositionListResponseDto> {
    const positions = await this.positionsService.findAll();
    return {
      succeeded: true,
      data: positions,
      message: 'Cargos listados com sucesso.',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cargo por ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({ status: 200, type: PositionResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
  @ApiResponse({ status: 404, type: NotFoundResponseDto })
  async findOne(@Param('id') id: string): Promise<PositionResponseDto> {
    const position = await this.positionsService.findOne(id);
    return {
      succeeded: true,
      data: position,
      message: 'Cargo encontrado com sucesso.',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar cargo' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({ status: 200, type: PositionResponseDto })
  @ApiResponse({ status: 400, type: BadRequestResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
  @ApiResponse({ status: 404, type: NotFoundResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePositionDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<PositionResponseDto> {
    const position = await this.positionsService.update(
      id,
      dto,
      req.user.username,
    );
    return {
      succeeded: true,
      data: position,
      message: 'Cargo atualizado com sucesso.',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover cargo' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({ status: 200, type: SuccessMessageResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
  @ApiResponse({ status: 404, type: NotFoundResponseDto })
  async remove(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<SuccessMessageResponseDto> {
    await this.positionsService.remove(id, req.user.username);
    return {
      succeeded: true,
      message: 'Cargo removido com sucesso',
    };
  }
}
