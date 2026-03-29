import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1774813898412 implements MigrationInterface {
  name = 'Migration1774813898412';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "USUARIOS" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "CRIADO_POR" character varying(20) NOT NULL, "CRIADO_EM" TIMESTAMP NOT NULL DEFAULT now(), "STATUS" character varying NOT NULL DEFAULT 'ATIVO', "ATUALIZADO_POR" character varying(20), "EXCLUIDO_POR" character varying(20), "NOME_USUARIO" character varying(255) NOT NULL, "EMAIL" character varying(255) NOT NULL, "SENHA" character varying(255) NOT NULL, "REFRESH_TOKEN" character varying(500), CONSTRAINT "UQ_58732285d128ece9975f6a6f376" UNIQUE ("EMAIL"), CONSTRAINT "PK_a40d3672036469cda0609a04423" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "DEPARTAMENTOS" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "CRIADO_POR" character varying(20) NOT NULL, "CRIADO_EM" TIMESTAMP NOT NULL DEFAULT now(), "STATUS" character varying NOT NULL DEFAULT 'ATIVO', "ATUALIZADO_POR" character varying(20), "EXCLUIDO_POR" character varying(20), "NOME" character varying(100) NOT NULL, "SIGLA" character varying(10) NOT NULL, "DESCRICAO" character varying(255), "DEPARTAMENTO_PAI_ID" uuid, CONSTRAINT "UQ_d50ea5239bc8e0a3387282ffe2e" UNIQUE ("NOME"), CONSTRAINT "UQ_e6d8fa794fabee6405e97bead49" UNIQUE ("SIGLA"), CONSTRAINT "PK_2962f9704986698985a00d030d3" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "CARGOS" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "CRIADO_POR" character varying(20) NOT NULL, "CRIADO_EM" TIMESTAMP NOT NULL DEFAULT now(), "STATUS" character varying NOT NULL DEFAULT 'ATIVO', "ATUALIZADO_POR" character varying(20), "EXCLUIDO_POR" character varying(20), "NOME" character varying(100) NOT NULL, "DESCRICAO" character varying(255), "NIVEL" character varying(50), "SALARIO_BASE" numeric(10,2) NOT NULL, "DEPARTAMENTO_ID" uuid, CONSTRAINT "UQ_4314d5763fa2ea9ab3d80d46556" UNIQUE ("NOME"), CONSTRAINT "PK_7a8be469630c6fbd56771ac0da2" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "FUNCIONARIOS" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "CRIADO_POR" character varying(20) NOT NULL, "CRIADO_EM" TIMESTAMP NOT NULL DEFAULT now(), "STATUS" character varying NOT NULL DEFAULT 'ATIVO', "ATUALIZADO_POR" character varying(20), "EXCLUIDO_POR" character varying(20), "MATRICULA" character varying(20) NOT NULL, "NOME" character varying(100) NOT NULL, "CPF" character varying(14) NOT NULL, "RG" character varying(20), "DATA_NASCIMENTO" date NOT NULL, "EMAIL" character varying(100) NOT NULL, "TELEFONE" character varying(20), "DATA_ADMISSAO" date NOT NULL, "DEPARTAMENTO_ID" uuid, "CARGO_ID" uuid, "GESTOR_ID" uuid, CONSTRAINT "UQ_9789d43d83e6dcafc46656af8c5" UNIQUE ("MATRICULA"), CONSTRAINT "UQ_495860e43b016c358cd81053bef" UNIQUE ("CPF"), CONSTRAINT "UQ_b040181b826fc142cc3b4a5e510" UNIQUE ("EMAIL"), CONSTRAINT "PK_5f148007c782d3f26363295856f" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "SOLICITACOES" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "CRIADO_POR" character varying(20) NOT NULL, "CRIADO_EM" TIMESTAMP NOT NULL DEFAULT now(), "STATUS" character varying NOT NULL DEFAULT 'ATIVO', "ATUALIZADO_POR" character varying(20), "EXCLUIDO_POR" character varying(20), "TIPO" character varying NOT NULL, "DESCRICAO" character varying(500) NOT NULL, "OBSERVACAO" character varying(500), "DATA_SOLICITACAO" date NOT NULL, "DATA_RESPOSTA" date, "APROVADO_POR_ID" uuid, CONSTRAINT "PK_39389e35be0bc44f08141942002" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "DEPARTAMENTOS" ADD CONSTRAINT "FK_c241d45d26b961fc6272ea3ea6b" FOREIGN KEY ("DEPARTAMENTO_PAI_ID") REFERENCES "DEPARTAMENTOS"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "CARGOS" ADD CONSTRAINT "FK_b4938a909b4212b8bb8d287dfea" FOREIGN KEY ("DEPARTAMENTO_ID") REFERENCES "DEPARTAMENTOS"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "FUNCIONARIOS" ADD CONSTRAINT "FK_ca7c1d34f7fbbdab13602baf26c" FOREIGN KEY ("DEPARTAMENTO_ID") REFERENCES "DEPARTAMENTOS"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "FUNCIONARIOS" ADD CONSTRAINT "FK_2f785ff2ca6b1fd9b2d05fc1913" FOREIGN KEY ("CARGO_ID") REFERENCES "CARGOS"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "FUNCIONARIOS" ADD CONSTRAINT "FK_61ece929939808a79179a545df7" FOREIGN KEY ("GESTOR_ID") REFERENCES "FUNCIONARIOS"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "SOLICITACOES" ADD CONSTRAINT "FK_21eaf45d18e96654bc91c022337" FOREIGN KEY ("APROVADO_POR_ID") REFERENCES "FUNCIONARIOS"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "SOLICITACOES" DROP CONSTRAINT "FK_21eaf45d18e96654bc91c022337"`,
    );
    await queryRunner.query(
      `ALTER TABLE "FUNCIONARIOS" DROP CONSTRAINT "FK_61ece929939808a79179a545df7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "FUNCIONARIOS" DROP CONSTRAINT "FK_2f785ff2ca6b1fd9b2d05fc1913"`,
    );
    await queryRunner.query(
      `ALTER TABLE "FUNCIONARIOS" DROP CONSTRAINT "FK_ca7c1d34f7fbbdab13602baf26c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "CARGOS" DROP CONSTRAINT "FK_b4938a909b4212b8bb8d287dfea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "DEPARTAMENTOS" DROP CONSTRAINT "FK_c241d45d26b961fc6272ea3ea6b"`,
    );
    await queryRunner.query(`DROP TABLE "SOLICITACOES"`);
    await queryRunner.query(`DROP TABLE "FUNCIONARIOS"`);
    await queryRunner.query(`DROP TABLE "CARGOS"`);
    await queryRunner.query(`DROP TABLE "DEPARTAMENTOS"`);
    await queryRunner.query(`DROP TABLE "USUARIOS"`);
  }
}
