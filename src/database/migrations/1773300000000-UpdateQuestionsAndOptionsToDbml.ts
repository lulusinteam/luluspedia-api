import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateQuestionsAndOptionsToDbml1773300000000
  implements MigrationInterface
{
  name = 'UpdateQuestionsAndOptionsToDbml1773300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Rename columns in tryouts
    await queryRunner.query(
      `ALTER TABLE "tryouts" RENAME COLUMN "isRecommended" TO "is_recommended"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryouts" RENAME COLUMN "showResult" TO "show_result"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryouts" RENAME COLUMN "showExplanation" TO "show_explanation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryouts" RENAME COLUMN "passScore" TO "pass_score"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryouts" RENAME COLUMN "scheduledAt" TO "scheduled_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryouts" RENAME COLUMN "publishedAt" TO "published_at"`,
    );

    // 2. Create difficulty enum
    await queryRunner.query(
      `CREATE TYPE "public"."difficulty_enum" AS ENUM('easy', 'medium', 'hard')`,
    );

    // 3. Rename columns in questions
    // Note: tryout_id is already correct from previous migration
    await queryRunner.query(
      `ALTER TABLE "questions" RENAME COLUMN "text" TO "content"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" RENAME COLUMN "attachment_id" TO "image_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" RENAME COLUMN "scoreWeight" TO "points"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" RENAME COLUMN "orderOverride" TO "order_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" RENAME COLUMN "questionType" TO "question_type"`,
    );

    // 4. Add new columns to questions
    await queryRunner.query(
      `ALTER TABLE "questions" ADD "explanation_image_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD "difficulty" "public"."difficulty_enum" NOT NULL DEFAULT 'medium'`,
    );

    // 5. Rename columns in options
    await queryRunner.query(
      `ALTER TABLE "options" RENAME COLUMN "text" TO "content"`,
    );
    await queryRunner.query(
      `ALTER TABLE "options" RENAME COLUMN "attachment_id" TO "image_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "options" RENAME COLUMN "orderOverride" TO "order_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "options" RENAME COLUMN "isCorrect" TO "is_correct"`,
    );

    // 6. Set random difficulty for existing questions
    await queryRunner.query(
      `UPDATE "questions" SET "difficulty" = (ARRAY['easy', 'medium', 'hard'])[floor(random() * 3 + 1)]::"public"."difficulty_enum"`,
    );

    // 7. Add foreign key for explanation_image_id
    await queryRunner.query(
      `ALTER TABLE "questions" ADD CONSTRAINT "FK_explanation_image" FOREIGN KEY ("explanation_image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert foreign key
    await queryRunner.query(
      `ALTER TABLE "questions" DROP CONSTRAINT "FK_explanation_image"`,
    );

    // Revert options
    await queryRunner.query(
      `ALTER TABLE "options" RENAME COLUMN "is_correct" TO "isCorrect"`,
    );
    await queryRunner.query(
      `ALTER TABLE "options" RENAME COLUMN "order_number" TO "orderOverride"`,
    );
    await queryRunner.query(
      `ALTER TABLE "options" RENAME COLUMN "image_id" TO "attachment_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "options" RENAME COLUMN "content" TO "text"`,
    );

    // Revert questions
    await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "difficulty"`);
    await queryRunner.query(
      `ALTER TABLE "questions" DROP COLUMN "explanation_image_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" RENAME COLUMN "order_number" TO "orderOverride"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" RENAME COLUMN "question_type" TO "questionType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" RENAME COLUMN "points" TO "scoreWeight"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" RENAME COLUMN "image_id" TO "attachment_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" RENAME COLUMN "content" TO "text"`,
    );

    // Drop enum
    await queryRunner.query(`DROP TYPE "public"."difficulty_enum"`);

    // Revert tryouts
    await queryRunner.query(
      `ALTER TABLE "tryouts" RENAME COLUMN "published_at" TO "publishedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryouts" RENAME COLUMN "scheduled_at" TO "scheduledAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryouts" RENAME COLUMN "pass_score" TO "passScore"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryouts" RENAME COLUMN "show_explanation" TO "showExplanation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryouts" RENAME COLUMN "show_result" TO "showResult"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryouts" RENAME COLUMN "is_recommended" TO "isRecommended"`,
    );
  }
}
