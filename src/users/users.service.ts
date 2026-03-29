import {
  Injectable,
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
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const hashed = await bcrypt.hash(dto.SENHA, 10);
    const user = this.usersRepository.create({ ...dto, SENHA: hashed });
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { ID: id } });

    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async validateCredentials(username: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { NOME_USUARIO: username },
    });

    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const passwordMatch = await bcrypt.compare(password, user.SENHA);
    if (!passwordMatch)
      throw new UnauthorizedException('Credenciais inválidas');

    return user;
  }

  async findForAuth(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { ID: userId } });
    if (!user) throw new UnauthorizedException('Usuário não encontrado');
    return user;
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.usersRepository.update(userId, { REFRESH_TOKEN: refreshToken });
  }
}
