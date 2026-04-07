import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1775572613662 implements MigrationInterface {
  name = 'Migration1775572613662';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "SOLICITACOES" ADD "FUNCIONARIO_ID" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "SOLICITACOES" ADD CONSTRAINT "FK_07c932a5f53e4ea6520fe9dbfe1" FOREIGN KEY ("FUNCIONARIO_ID") REFERENCES "FUNCIONARIOS"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "SOLICITACOES" DROP CONSTRAINT "FK_07c932a5f53e4ea6520fe9dbfe1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SOLICITACOES" DROP COLUMN "FUNCIONARIO_ID"`,
    );
  }
}
