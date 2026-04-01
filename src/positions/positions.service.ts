import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { Repository } from 'typeorm';
import { Position } from './entities/position.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from 'src/departments/entities/department.entity';

@Injectable()
export class PositionsService {
  private readonly logger = new Logger(PositionsService.name);

  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) {}

  async create(dto: CreatePositionDto, createdBy: string): Promise<Position> {
    const existing = await this.positionRepository.findOne({
      where: { NOME: dto.NOME },
    });

    if (existing) {
      throw new ConflictException('Já existe um cargo com esse nome');
    }

    const position = this.positionRepository.create({
      NOME: dto.NOME,
      DESCRICAO: dto.DESCRICAO ?? null,
      NIVEL: dto.NIVEL ?? null,
      SALARIO_BASE: dto.SALARIO_BASE ?? null,
      CRIADO_POR: createdBy,
      ...(dto.DEPARTAMENTO_ID
        ? { DEPARTAMENTO: { ID: dto.DEPARTAMENTO_ID } as Department }
        : {}),
    });

    const saved = await this.positionRepository.save(position);
    this.logger.log(`Cargo ${saved.ID} criado por ${createdBy}`);
    return saved;
  }

  async findAll(): Promise<Position[]> {
    return this.positionRepository.find({
      relations: ['DEPARTAMENTO'],
    });
  }

  async findOne(id: string): Promise<Position> {
    const position = await this.positionRepository.findOne({
      where: { ID: id },
      relations: ['DEPARTAMENTO'],
    });

    if (!position) {
      this.logger.warn(`Cargo ${id} não encontrado`);
      throw new NotFoundException(`Cargo com ID ${id} não encontrado`);
    }

    return position;
  }

  async update(
    id: string,
    dto: UpdatePositionDto,
    updatedBy: string,
  ): Promise<Position> {
    const position = await this.findOne(id);

    Object.assign(position, {
      ...dto,
      DEPARTAMENTO_ID: dto.DEPARTAMENTO_ID
        ? ({ ID: dto.DEPARTAMENTO_ID } as Department)
        : position.DEPARTAMENTO,
      ATUALIZADO_POR: updatedBy,
    });

    const saved = await this.positionRepository.save(position);
    this.logger.log(`Cargo ${id} atualizado por ${updatedBy}`);
    return saved;
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const position = await this.findOne(id);
    await this.positionRepository.remove(position);
    this.logger.log(`Cargo ${id} removido por ${deletedBy}`);
  }
}
