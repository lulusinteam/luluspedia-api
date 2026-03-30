import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveExplanationFromQuestions1774843397025
  implements MigrationInterface
{
  name = 'RemoveExplanationFromQuestions1774843397025';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "questions" DROP CONSTRAINT "FK_43a5b45072787a0e1f09d9927fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" DROP COLUMN "explanation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" DROP COLUMN "explanation_image_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "questions" ADD "explanation_image_id" uuid`,
    );
    await queryRunner.query(`ALTER TABLE "questions" ADD "explanation" text`);
    await queryRunner.query(
      `ALTER TABLE "questions" ADD CONSTRAINT "FK_43a5b45072787a0e1f09d9927fe" FOREIGN KEY ("explanation_image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
