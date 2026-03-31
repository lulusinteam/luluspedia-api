import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTryoutsTable1774930975140 implements MigrationInterface {
  name = 'CreateUserTryoutsTable1774930975140';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_tryouts_status_enum" AS ENUM('in_progress', 'completed', 'abandoned')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_tryouts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "start_time" TIMESTAMP NOT NULL DEFAULT now(), "end_time" TIMESTAMP, "total_score" integer NOT NULL DEFAULT '0', "status" "public"."user_tryouts_status_enum" NOT NULL DEFAULT 'in_progress', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid, "tryout_id" uuid, CONSTRAINT "PK_8fd1d4c41d2b9cdb72d4ef11597" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tryouts" ADD CONSTRAINT "FK_3aa021826a2dfa2f8f87376d76f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tryouts" ADD CONSTRAINT "FK_733efe812c16bba0d6a96d9d31d" FOREIGN KEY ("tryout_id") REFERENCES "tryouts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_tryouts" DROP CONSTRAINT "FK_733efe812c16bba0d6a96d9d31d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tryouts" DROP CONSTRAINT "FK_3aa021826a2dfa2f8f87376d76f"`,
    );
    await queryRunner.query(`DROP TABLE "user_tryouts"`);
    await queryRunner.query(`DROP TYPE "public"."user_tryouts_status_enum"`);
  }
}
