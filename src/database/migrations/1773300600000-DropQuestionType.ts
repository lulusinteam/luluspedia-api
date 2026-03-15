import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropQuestionType1773300600000 implements MigrationInterface {
  name = 'DropQuestionType1773300600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "questions" DROP COLUMN "question_type"`,
    );
    await queryRunner.query(`DROP TYPE "public"."question_questiontype_enum"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."question_questiontype_enum" AS ENUM('multiple_choice', 'multiple_select', 'boolean', 'essay')`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD "question_type" "public"."question_questiontype_enum" NOT NULL DEFAULT 'multiple_choice'`,
    );
  }
}
