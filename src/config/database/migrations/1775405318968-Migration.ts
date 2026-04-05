import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1775405318968 implements MigrationInterface {
  name = 'Migration1775405318968';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "FERIAS" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "CRIADO_POR" character varying(20) NOT NULL, "CRIADO_EM" TIMESTAMP NOT NULL DEFAULT now(), "STATUS" character varying NOT NULL DEFAULT 'ATIVO', "ATUALIZADO_POR" character varying(20), "EXCLUIDO_POR" character varying(20), "DATA_INICIO" date NOT NULL, "DATA_FIM" date NOT NULL, "DIAS_SOLICITADOS" integer NOT NULL, "STATUS_FERIAS" character varying NOT NULL DEFAULT 'PENDENTE', "OBSERVACAO" character varying(500), "DATA_APROVACAO" date, "FUNCIONARIO_ID" uuid, "APROVADO_POR_ID" uuid, CONSTRAINT "PK_0d87e6d07739b5d4842043425b4" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "FERIAS" ADD CONSTRAINT "FK_85aa56228df8b9e847e180dbd6e" FOREIGN KEY ("FUNCIONARIO_ID") REFERENCES "FUNCIONARIOS"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "FERIAS" ADD CONSTRAINT "FK_48ccdab657f915aae77299303ee" FOREIGN KEY ("APROVADO_POR_ID") REFERENCES "FUNCIONARIOS"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "FERIAS" DROP CONSTRAINT "FK_48ccdab657f915aae77299303ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "FERIAS" DROP CONSTRAINT "FK_85aa56228df8b9e847e180dbd6e"`,
    );
    await queryRunner.query(`DROP TABLE "FERIAS"`);
  }
}
