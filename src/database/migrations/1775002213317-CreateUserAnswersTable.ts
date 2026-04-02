import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAnswersTable1775002213317 implements MigrationInterface {
  name = 'CreateUserAnswersTable1775002213317';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_answers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_tryout_id" uuid, "question_id" uuid, "option_id" uuid, CONSTRAINT "UQ_f3b8b8d1f3494d49b161b67bafe" UNIQUE ("user_tryout_id", "question_id"), CONSTRAINT "PK_08977c1a2a5f1b8b472dbd87d04" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_answers" ADD CONSTRAINT "FK_6173c020ded516b77f79e91bbf8" FOREIGN KEY ("user_tryout_id") REFERENCES "user_tryouts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_answers" ADD CONSTRAINT "FK_adae59e684b873b084be36c5a7a" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_answers" ADD CONSTRAINT "FK_d712cea87e9712541cc372f120a" FOREIGN KEY ("option_id") REFERENCES "options"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_answers" DROP CONSTRAINT "FK_d712cea87e9712541cc372f120a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_answers" DROP CONSTRAINT "FK_adae59e684b873b084be36c5a7a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_answers" DROP CONSTRAINT "FK_6173c020ded516b77f79e91bbf8"`,
    );
    await queryRunner.query(`DROP TABLE "user_answers"`);
  }
}
