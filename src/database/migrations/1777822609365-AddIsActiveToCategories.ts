import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsActiveToCategories1777822609365
  implements MigrationInterface
{
  name = 'AddIsActiveToCategories1777822609365';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "is_active" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "is_active"`);
  }
}
