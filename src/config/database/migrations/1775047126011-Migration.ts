import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1775047126011 implements MigrationInterface {
  name = 'Migration1775047126011';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "CARGOS" ALTER COLUMN "SALARIO_BASE" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "CARGOS" ALTER COLUMN "SALARIO_BASE" SET NOT NULL`,
    );
  }
}
