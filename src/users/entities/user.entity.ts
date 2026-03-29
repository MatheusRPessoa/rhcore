import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('USUARIOS')
export class User extends BaseEntity {
  @Column({
    name: 'NOME_USUARIO',
    length: 255,
  })
  NOME_USUARIO: string;

  @Column({
    name: 'EMAIL',
    length: 255,
    unique: true,
  })
  EMAIL: string;

  @Column({
    name: 'SENHA',
    length: 255,
  })
  SENHA: string;

  @Column({
    name: 'REFRESH_TOKEN',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  REFRESH_TOKEN: string | null;
}
