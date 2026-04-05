import { Employee } from 'src/employees/entities/employee.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { VacationStatusEnum } from '../enums/vacation-status.enum';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('FERIAS')
export class Vacation extends BaseEntity {
  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'FUNCIONARIO_ID' })
  FUNCIONARIO: Employee;

  @Column({ name: 'DATA_INICIO', type: 'date' })
  DATA_INICIO: Date;

  @Column({ name: 'DATA_FIM', type: 'date' })
  DATA_FIM: Date;

  @Column({ name: 'DIAS_SOLICITADOS', type: 'int' })
  DIAS_SOLICITADOS: number;

  @Column({
    name: 'STATUS_FERIAS',
    type: 'varchar',
    enum: VacationStatusEnum,
    default: VacationStatusEnum.PENDENTE,
  })
  STATUS_FERIAS: VacationStatusEnum;

  @Column({
    name: 'OBSERVACAO',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  OBSERVACAO: string | null;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'APROVADO_POR_ID' })
  APROVADO_POR: Employee | null;

  @Column({ name: 'DATA_APROVACAO', type: 'date', nullable: true })
  DATA_APROVACAO: Date | null;
}
