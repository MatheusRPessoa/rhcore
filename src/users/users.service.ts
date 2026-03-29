import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

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
