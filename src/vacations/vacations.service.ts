import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { UpdateVacationDto } from './dto/update-vacation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vacation } from './entities/vacation.entity';
import { Repository } from 'typeorm';
import { Employee } from 'src/employees/entities/employee.entity';
import { VacationStatusEnum } from './enums/vacation-status.enum';

@Injectable()
export class VacationsService {
  private readonly logger = new Logger(VacationsService.name);

  constructor(
    @InjectRepository(Vacation)
    private readonly vacationRepository: Repository<Vacation>,
  ) {}

  async create(dto: CreateVacationDto, createdBy: string): Promise<Vacation> {
    const dataInicio = new Date(dto.DATA_INICIO);
    const dataFim = new Date(dto.DATA_FIM);

    if (dataFim <= dataInicio) {
      throw new BadRequestException(
        'A data fim deve ser superior à data início',
      );
    }

    const diffMs = dataFim.getTime() - dataInicio.getTime();
    const diasSolicitados = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    const vacation = this.vacationRepository.create({
      FUNCIONARIO: { ID: dto.FUNCIONARIO_ID } as Employee,
      DATA_INICIO: dataInicio,
      DATA_FIM: dataFim,
      DIAS_SOLICITADOS: diasSolicitados,
      STATUS_FERIAS: VacationStatusEnum.PENDENTE,
      OBSERVACAO: dto.OBSERVACAO ?? null,
      APROVADO_POR: null,
      DATA_APROVACAO: null,
      CRIADO_POR: createdBy,
    });

    const saved = await this.vacationRepository.save(vacation);
    this.logger.log(`Férias ${saved.ID} criadas por ${createdBy}`);
    return saved;
  }

  async findAll(): Promise<Vacation[]> {
    return this.vacationRepository.find({
      relations: ['FUNCIONARIO', 'APROVADO_POR'],
    });
  }

  async findOne(id: string): Promise<Vacation> {
    const vacation = await this.vacationRepository.findOne({
      where: { ID: id },
      relations: ['FUNCIONARIO', 'APROVADO_POR'],
    });

    if (!vacation) {
      this.logger.warn(`Férias ${id} não encontradas`);
      throw new NotFoundException(`Férias com ID ${id} não encontradas`);
    }

    return vacation;
  }

  async update(
    id: string,
    dto: UpdateVacationDto,
    updatedBy: string,
  ): Promise<Vacation> {
    const vacation = await this.findOne(id);

    const dataInicio = new Date(dto.DATA_INICIO ?? vacation.DATA_INICIO);
    const dataFim = new Date(dto.DATA_FIM ?? vacation.DATA_FIM);

    if (dataFim <= dataInicio) {
      throw new BadRequestException(
        'A data de fim deve ser posterior à data de início',
      );
    }

    const diffMs = dataFim.getTime() - dataInicio.getTime();
    const diasSolicitados = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    Object.assign(vacation, {
      DATA_INICIO: dataInicio,
      DATA_FIM: dataFim,
      DIAS_SOLICITADOS: diasSolicitados,
      ...(dto.STATUS_FERIAS !== undefined && {
        STATUS_FERIAS: dto.STATUS_FERIAS,
      }),
      ...(dto.OBSERVACAO !== undefined && { OBSERVACAO: dto.OBSERVACAO }),
      ...(dto.APROVADO_POR_ID !== undefined && {
        APROVADO_POR: { ID: dto.APROVADO_POR_ID } as Employee,
      }),
      ...(dto.DATA_APROVACAO !== undefined && {
        DATA_APROVACAO: new Date(dto.DATA_APROVACAO),
      }),
      ATUALIZADO_POR: updatedBy,
    });

    const saved = await this.vacationRepository.save(vacation);
    this.logger.log(`Férias ${id} atualizados por ${updatedBy}`);
    return saved;
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const vacation = await this.findOne(id);
    await this.vacationRepository.remove(vacation);
    this.logger.log(`Férias ${id} removidas por ${deletedBy}`);
  }
}
