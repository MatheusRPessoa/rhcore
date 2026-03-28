import { BaseEntity, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('DEPARTAMENTOS')
export class Department extends BaseEntity {
  @Column({
    name: 'NOME',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  NOME: string;

  @Column({
    name: 'SIGLA',
    type: 'varchar',
    length: 10,
    unique: true,
  })
  SIGLA: string;

  @Column({
    name: 'DESCRICAO',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  DESCRICAO: string | null;

  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({ name: 'DEPARTAMENTO_PAI_ID' })
  DEPARTAMENTO_PAI: Department;
}
