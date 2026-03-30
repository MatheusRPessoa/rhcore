import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.usersService.validateCredentials(
      username,
      password,
    );
    const tokens = await this.generateTokens(user.ID, user.NOME_USUARIO);
    await this.saveRefreshToken(user.ID, tokens.refresh_token);

    return {
      succeeded: true,
      data: tokens,
      message: 'Login realizado com sucesso.',
    };
  }

  async refresh(userId: string, refresh_token: string) {
    const user = await this.usersService.findForAuth(userId);

    if (!user.REFRESH_TOKEN) throw new UnauthorizedException('Acesso negado');

    const tokenMatch = await bcrypt.compare(refresh_token, user.REFRESH_TOKEN);
    if (!tokenMatch) throw new UnauthorizedException('Refresh token inválido');

    const tokens = await this.generateTokens(user.ID, user.NOME_USUARIO);
    await this.saveRefreshToken(user.ID, tokens.refresh_token);
    return {
      succeeded: true,
      data: tokens,
      message: 'Token atualizado com sucesso',
    };
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return {
      succeeded: true,
      data: null,
      message: 'Logout realizado com sucesso',
    };
  }

  private async generateTokens(userId: string, username: string) {
    const payload = { username, sub: userId };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '1d' }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      }),
    ]);
    return { access_token, refresh_token };
  }

  private async saveRefreshToken(userId: string, refresh_token: string) {
    const hashed = await bcrypt.hash(refresh_token, 10);
    await this.usersService.updateRefreshToken(userId, hashed);
  }
}
