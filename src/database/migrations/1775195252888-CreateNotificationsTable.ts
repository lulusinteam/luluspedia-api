import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNotificationsTable1775195252888
  implements MigrationInterface
{
  name = 'CreateNotificationsTable1775195252888';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying, "message" text NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9a8a82462cab47c73d25f49261" ON "notifications" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f12148ce379462ebbb4d06cc13" ON "notifications" ("is_read") `,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f12148ce379462ebbb4d06cc13"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9a8a82462cab47c73d25f49261"`,
    );
    await queryRunner.query(`DROP TABLE "notifications"`);
  }
}
