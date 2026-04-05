import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { VacationsService } from './vacations.service';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { UpdateVacationDto } from './dto/update-vacation.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  VacationListResponseDto,
  VacationResponseDto,
} from './dto/vacation-response.dto';
import {
  BadRequestResponseDto,
  NotFoundResponseDto,
  UnauthorizedResponseDto,
} from 'src/common/dto/error-response.dto';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { SuccessMessageResponseDto } from 'src/common/dto/base-response.dto';

@ApiTags('Férias')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('vacations')
export class VacationsController {
  constructor(private readonly vacationsService: VacationsService) {}

  @Post()
  @ApiOperation({ summary: 'Solicitar férias' })
  @ApiResponse({ status: 201, type: VacationResponseDto })
  @ApiResponse({ status: 400, type: BadRequestResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
  async create(
    @Body() dto: CreateVacationDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<VacationResponseDto> {
    const vacation = await this.vacationsService.create(dto, req.user.username);
    return {
      succeeded: true,
      data: vacation as any,
      message: 'Férias solicitadas com sucesso.',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar férias' })
  @ApiResponse({ status: 200, type: VacationListResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
  async findAll(): Promise<VacationListResponseDto> {
    const vacations = await this.vacationsService.findAll();
    return {
      succeeded: true,
      data: vacations as any,
      message: 'Férias listadas com sucesso.',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar férias por ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({ status: 200, type: VacationResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
  @ApiResponse({ status: 404, type: NotFoundResponseDto })
  async findOne(@Param('id') id: string): Promise<VacationResponseDto> {
    const vacation = await this.vacationsService.findOne(id);
    return {
      succeeded: true,
      data: vacation,
      message: 'Férias encontradas com sucesso.',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar férias' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({ status: 200, type: VacationResponseDto })
  @ApiResponse({ status: 400, type: BadRequestResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
  @ApiResponse({ status: 404, type: NotFoundResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateVacationDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<VacationResponseDto> {
    const vacation = await this.vacationsService.update(
      id,
      dto,
      req.user.username,
    );
    return {
      succeeded: true,
      data: vacation,
      message: 'Férias atualizadas com sucesso.',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover férias' })
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
    await this.vacationsService.remove(id, req.user.username);
    return {
      succeeded: true,
      message: 'Férias removidas com sucesso.',
    };
  }
}
