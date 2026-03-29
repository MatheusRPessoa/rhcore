import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto, createdBy: string): Promise<User> {
    const hashed = await bcrypt.hash(dto.SENHA, 10);
    const user = this.usersRepository.create({
      ...dto,
      SENHA: hashed,
      CRIADO_POR: createdBy,
    });

    const saved = await this.usersRepository.save(user);
    this.logger.log(`Usuário ${saved.ID} criado por ${createdBy}`);
    return saved;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { ID: id } });

    if (!user) {
      this.logger.warn(`Usuário ${id} não encontrado`);
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    return user;
  }

  async update(
    id: string,
    dto: UpdateUserDto,
    updatedBy?: string,
  ): Promise<User> {
    const user = await this.findOne(id);

    Object.assign(user, dto);

    if (updatedBy) {
      user.ATUALIZADO_POR = updatedBy;
    }

    const saved = await this.usersRepository.save(user);
    this.logger.log(`Usuário ${id} atualizado por ${updatedBy ?? 'sistema'}`);
    return saved;
  }

  async remove(id: string, deletedBy?: string): Promise<void> {
    const user = await this.findOne(id);

    await this.usersRepository.remove(user);
    this.logger.log(`Usuário ${id} removido por ${deletedBy ?? 'sistema'}`);
  }

  async validateCredentials(username: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { NOME_USUARIO: username },
    });

    if (!user) {
      this.logger.warn(
        `Tentativa de login com usuário inexistente: ${username}`,
      );
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordMatch = await bcrypt.compare(password, user.SENHA);

    if (!passwordMatch) {
      this.logger.warn(`Senha incorreta para o usuário: ${username}`);
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return user;
  }

  async findForAuth(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { ID: userId } });

    if (!user) {
      this.logger.warn(`Usuário ${userId} não encontrado para autenticação`);
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return user;
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.usersRepository.update(userId, { REFRESH_TOKEN: refreshToken });
  }
}
