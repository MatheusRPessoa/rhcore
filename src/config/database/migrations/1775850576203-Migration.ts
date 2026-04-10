import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1775850576203 implements MigrationInterface {
  name = 'Migration1775850576203';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "FERIAS" DROP CONSTRAINT "FK_48ccdab657f915aae77299303ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "FERIAS" ADD CONSTRAINT "FK_48ccdab657f915aae77299303ee" FOREIGN KEY ("APROVADO_POR_ID") REFERENCES "USUARIOS"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "FERIAS" DROP CONSTRAINT "FK_48ccdab657f915aae77299303ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "FERIAS" ADD CONSTRAINT "FK_48ccdab657f915aae77299303ee" FOREIGN KEY ("APROVADO_POR_ID") REFERENCES "FUNCIONARIOS"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
