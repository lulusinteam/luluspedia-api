import { MigrationInterface, QueryRunner } from 'typeorm';

export class ScaffoldTryoutsModule1772850666437 implements MigrationInterface {
  name = 'ScaffoldTryoutsModule1772850666437';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying NOT NULL, "label" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_cb73208f151aa71cdd78f662d70" UNIQUE ("slug"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tryout_status_enum" AS ENUM('draft', 'scheduled', 'published', 'archived')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tryout" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "isRecommended" boolean NOT NULL DEFAULT false, "duration" integer NOT NULL, "isShuffled" boolean NOT NULL DEFAULT false, "showResult" boolean NOT NULL DEFAULT true, "showExplanation" boolean NOT NULL DEFAULT true, "passScore" integer NOT NULL DEFAULT '0', "status" "public"."tryout_status_enum" NOT NULL DEFAULT 'draft', "scheduledAt" TIMESTAMP, "publishedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "category_id" uuid, "cover_id" uuid, CONSTRAINT "PK_13bf036c7170e95efb18d0ea023" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."question_questiontype_enum" AS ENUM('multiple_choice', 'multiple_select', 'boolean', 'essay')`,
    );
    await queryRunner.query(
      `CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" text NOT NULL, "questionType" "public"."question_questiontype_enum" NOT NULL DEFAULT 'multiple_choice', "scoreWeight" integer NOT NULL DEFAULT '1', "explanation" text, "orderOverride" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "tryout_id" uuid, "attachment_id" uuid, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "option" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" text NOT NULL, "isCorrect" boolean NOT NULL DEFAULT false, "orderOverride" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "question_id" uuid, "attachment_id" uuid, CONSTRAINT "PK_e6090c1c6ad8962eea97abdbe63" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryout" ADD CONSTRAINT "FK_0d119c970ca64e8924346fd4b0d" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryout" ADD CONSTRAINT "FK_cf9272b0844e4b81db87d21371a" FOREIGN KEY ("cover_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_31ca854db505e7492962c272a28" FOREIGN KEY ("tryout_id") REFERENCES "tryout"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_ab33e4014e9801b146698451aff" FOREIGN KEY ("attachment_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "option" ADD CONSTRAINT "FK_790cf6b252b5bb48cd8fc1d272b" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "option" ADD CONSTRAINT "FK_686e68393d9bd9387ef3a54f0b6" FOREIGN KEY ("attachment_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "option" DROP CONSTRAINT "FK_686e68393d9bd9387ef3a54f0b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "option" DROP CONSTRAINT "FK_790cf6b252b5bb48cd8fc1d272b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "FK_ab33e4014e9801b146698451aff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "FK_31ca854db505e7492962c272a28"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryout" DROP CONSTRAINT "FK_cf9272b0844e4b81db87d21371a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryout" DROP CONSTRAINT "FK_0d119c970ca64e8924346fd4b0d"`,
    );
    await queryRunner.query(`DROP TABLE "option"`);
    await queryRunner.query(`DROP TABLE "question"`);
    await queryRunner.query(`DROP TYPE "public"."question_questiontype_enum"`);
    await queryRunner.query(`DROP TABLE "tryout"`);
    await queryRunner.query(`DROP TYPE "public"."tryout_status_enum"`);
    await queryRunner.query(`DROP TABLE "category"`);
  }
}
