import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSnapshotToUserAnswersV31777578648143
  implements MigrationInterface
{
  name = 'AddSnapshotToUserAnswersV31777578648143';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_answers" ADD "is_correct_snapshot" boolean`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_answers" ADD "weight_snapshot" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_answers" ADD "points_snapshot" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_answers" ADD "question_snapshot" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_answers" ADD "option_snapshot" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_answers" DROP COLUMN "option_snapshot"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_answers" DROP COLUMN "question_snapshot"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_answers" DROP COLUMN "points_snapshot"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_answers" DROP COLUMN "weight_snapshot"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_answers" DROP COLUMN "is_correct_snapshot"`,
    );
  }
}
