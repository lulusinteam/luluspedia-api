import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRatingsTable1773301200000 implements MigrationInterface {
  name = 'CreateRatingsTable1773301200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "ratings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "rateable_id" uuid NOT NULL,
        "rateable_type" character varying NOT NULL,
        "score" integer NOT NULL,
        "review" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "user_id" uuid,
        CONSTRAINT "PK_ratings_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_ratings_rateable" ON "ratings" ("rateable_id", "rateable_type")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_ratings_user_id" ON "ratings" ("user_id")
    `);
    await queryRunner.query(`
      ALTER TABLE "ratings" ADD CONSTRAINT "FK_ratings_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ratings" DROP CONSTRAINT "FK_ratings_user_id"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_ratings_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_ratings_rateable"`);
    await queryRunner.query(`DROP TABLE "ratings"`);
  }
}
