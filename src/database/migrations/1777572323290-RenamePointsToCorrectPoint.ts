import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenamePointsToCorrectPoint1777572323290
  implements MigrationInterface
{
  name = 'RenamePointsToCorrectPoint1777572323290';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "questions" RENAME COLUMN "points" TO "correct_point"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ALTER COLUMN "correct_point" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ALTER COLUMN "correct_point" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "questions" ALTER COLUMN "correct_point" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ALTER COLUMN "correct_point" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" RENAME COLUMN "correct_point" TO "points"`,
    );
  }
}
