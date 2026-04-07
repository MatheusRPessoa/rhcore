import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from './entities/request.entity';
import { Repository } from 'typeorm';
import { Employee } from 'src/employees/entities/employee.entity';

@Injectable()
export class RequestsService {
  private readonly logger = new Logger(RequestsService.name);

  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
  ) {}

  async create(dto: CreateRequestDto, createdBy: string): Promise<Request> {
    const request = this.requestRepository.create({
      FUNCIONARIO: { ID: dto.FUNCIONARIO_ID } as Employee,
      TIPO: dto.TIPO,
      DESCRICAO: dto.DESCRICAO,
      DATA_SOLICITACAO: new Date(dto.DATA_SOLICITACAO),
      OBSERVACAO: dto.OBSERVACAO ?? null,
      CRIADO_POR: createdBy,
    });

    const saved = await this.requestRepository.save(request);
    this.logger.log(`Solicitação ${saved.ID} criada por ${createdBy}`);
    return saved;
  }

  async findAll(): Promise<Request[]> {
    return this.requestRepository.find({
      relations: ['FUNCIONARIO', 'APROVADO_POR'],
    });
  }

  async findOne(id: string): Promise<Request> {
    const request = await this.requestRepository.findOne({
      where: { ID: id },
      relations: ['FUNCIONARIO', 'APROVADO_POR'],
    });

    if (!request) {
      this.logger.warn(`Solicitação ${id} não encontrada`);
      throw new NotFoundException(`Solicitação com ID ${id} não encontrada`);
    }

    return request;
  }

  async update(
    id: string,
    dto: UpdateRequestDto,
    updateBy: string,
  ): Promise<Request> {
    const request = await this.findOne(id);

    Object.assign(request, {
      ...(dto.TIPO !== undefined && { TIPO: dto.TIPO }),
      ...(dto.DESCRICAO !== undefined && { DESCRICAO: dto.DESCRICAO }),
      ...(dto.OBSERVACAO !== undefined && { OBSERVACAO: dto.OBSERVACAO }),
      ...(dto.DATA_RESPOSTA !== undefined && {
        DATA_RESPOSTA: new Date(dto.DATA_RESPOSTA),
      }),
      ...(dto.APROVADO_POR_ID !== undefined && {
        APROVADO_POR: { ID: dto.APROVADO_POR_ID } as Employee,
      }),
      ATUALIZADO_POR: updateBy,
    });

    const saved = await this.requestRepository.save(request);
    this.logger.log(`Solicitação ${id} atualizada por ${updateBy}`);
    return saved;
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const request = await this.findOne(id);
    await this.requestRepository.remove(request);
    this.logger.log(`Solicitação ${id} removida por ${deletedBy}`);
  }
}
