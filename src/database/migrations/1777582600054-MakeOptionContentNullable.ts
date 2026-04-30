import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeOptionContentNullable1777582600054
  implements MigrationInterface
{
  name = 'MakeOptionContentNullable1777582600054';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "options" ALTER COLUMN "content" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "options" ALTER COLUMN "content" SET NOT NULL`,
    );
  }
}
