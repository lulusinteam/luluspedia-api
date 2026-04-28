import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQuestionOrderToUserTryouts1777383184820
  implements MigrationInterface
{
  name = 'AddQuestionOrderToUserTryouts1777383184820';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_tryouts" ADD "question_order" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_tryouts" DROP COLUMN "question_order"`,
    );
  }
}
