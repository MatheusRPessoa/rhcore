import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  private readonly logger = new Logger(DepartmentsService.name);

  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(
    dto: CreateDepartmentDto,
    createdBy: string,
  ): Promise<Department> {
    const existing = await this.departmentRepository.findOne({
      where: [{ NOME: dto.NOME }, { SIGLA: dto.SIGLA }],
    });

    if (existing) {
      throw new ConflictException(
        'Já existe um departamento com esse nome ou sigla',
      );
    }

    const department = this.departmentRepository.create({
      NOME: dto.NOME,
      SIGLA: dto.SIGLA,
      DESCRICAO: dto.DESCRICAO ?? null,
      CRIADO_POR: createdBy,
      ...(dto.DEPARTAMENTO_PAI_ID
        ? { DEPARTAMENTO_PAI: { ID: dto.DEPARTAMENTO_PAI_ID } as Department }
        : {}),
    });

    const saved = await this.departmentRepository.save(department);
    this.logger.log(`Departamento ${saved.ID} criado por ${createdBy}`);
    return saved;
  }

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find({
      relations: ['DEPARTAMENTO_PAI'],
    });
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { ID: id },
      relations: ['DEPARTAMENTO_PAI'],
    });

    if (!department) {
      this.logger.warn(`Departamento ${id} não encontrado`);
      throw new NotFoundException(`Departamento com ID ${id} não encontrado`);
    }

    return department;
  }

  async update(
    id: string,
    dto: UpdateDepartmentDto,
    updatedBy: string,
  ): Promise<Department> {
    const department = await this.findOne(id);

    Object.assign(department, {
      ...dto,
      DEPARTAMENTO_PAI_ID: dto.DEPARTAMENTO_PAI_ID
        ? ({ ID: dto.DEPARTAMENTO_PAI_ID } as Department)
        : department.DEPARTAMENTO_PAI,
      ATUALIZADO_POR: updatedBy,
    });

    const saved = await this.departmentRepository.save(department);
    this.logger.log(`Departamento ${id} atualizado por ${updatedBy}`);
    return saved;
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const departament = await this.findOne(id);
    await this.departmentRepository.remove(departament);
    this.logger.log(`Departamento ${id} removido por ${deletedBy}`);
  }
}
