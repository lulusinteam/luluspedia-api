import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddScoringTypeAndWeight1774843176602
  implements MigrationInterface
{
  name = 'AddScoringTypeAndWeight1774843176602';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wishlists" DROP CONSTRAINT "FK_wishlists_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "options" DROP CONSTRAINT "FK_790cf6b252b5bb48cd8fc1d272b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "options" DROP CONSTRAINT "FK_686e68393d9bd9387ef3a54f0b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" DROP CONSTRAINT "FK_explanation_image"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" DROP CONSTRAINT "FK_31ca854db505e7492962c272a28"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" DROP CONSTRAINT "FK_ab33e4014e9801b146698451aff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryouts" DROP CONSTRAINT "FK_0d119c970ca64e8924346fd4b0d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryouts" DROP CONSTRAINT "FK_cf9272b0844e4b81db87d21371a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "search_history" DROP CONSTRAINT "FK_search_history_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ratings" DROP CONSTRAINT "FK_ratings_user_id"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_wishlists_wishlistable"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_wishlists_user_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_search_history_query"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ratings_rateable"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ratings_user_id"`);
    await queryRunner.query(
      `ALTER TABLE "search_history" RENAME COLUMN "userId" TO "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "options" ADD "weight" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."questions_scoringtype_enum" AS ENUM('point', 'weight')`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD "scoringType" "public"."questions_scoringtype_enum" NOT NULL DEFAULT 'point'`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ALTER COLUMN "order_number" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ALTER COLUMN "order_number" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."difficulty_enum" RENAME TO "difficulty_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."questions_difficulty_enum" AS ENUM('easy', 'medium', 'hard')`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ALTER COLUMN "difficulty" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ALTER COLUMN "difficulty" TYPE "public"."questions_difficulty_enum" USING "difficulty"::"text"::"public"."questions_difficulty_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ALTER COLUMN "difficulty" SET DEFAULT 'medium'`,
    );
    await queryRunner.query(`DROP TYPE "public"."difficulty_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "questions" ALTER COLUMN "points" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."tryout_status_enum" RENAME TO "tryout_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tryouts_status_enum" AS ENUM('draft', 'scheduled', 'published', 'archived')`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryouts" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryouts" ALTER COLUMN "status" TYPE "public"."tryouts_status_enum" USING "status"::"text"::"public"."tryouts_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryouts" ALTER COLUMN "status" SET DEFAULT 'draft'`,
    );
    await queryRunner.query(`DROP TYPE "public"."tryout_status_enum_old"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_db37ddc475003359650c81b5e2" ON "wishlists" ("wishlistable_id", "wishlistable_type") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_28c0159d8d5cbca27380289e41" ON "search_history" ("query") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_576ad12dfb750f4eb166eca1d2" ON "ratings" ("rateable_id", "rateable_type") `,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlists" ADD CONSTRAINT "FK_b5e6331a1a7d61c25d7a25cab8f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "options" ADD CONSTRAINT "FK_2bdd03245b8cb040130fe16f21d" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "options" ADD CONSTRAINT "FK_6d364369f4b09f53b5c4f83667c" FOREIGN KEY ("image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD CONSTRAINT "FK_eaac8582bed6bdf262a8248fc4e" FOREIGN KEY ("tryout_id") REFERENCES "tryouts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD CONSTRAINT "FK_c3a97cface66e060976f19bb9a6" FOREIGN KEY ("image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD CONSTRAINT "FK_43a5b45072787a0e1f09d9927fe" FOREIGN KEY ("explanation_image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryouts" ADD CONSTRAINT "FK_2f2ba700586da04b36838e89e7a" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryouts" ADD CONSTRAINT "FK_91569c1f051b3dfcd633ed67760" FOREIGN KEY ("cover_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "search_history" ADD CONSTRAINT "FK_d1ebf4101b2804213251e0a04d2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ratings" ADD CONSTRAINT "FK_f49ef8d0914a14decddbb170f2f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ratings" DROP CONSTRAINT "FK_f49ef8d0914a14decddbb170f2f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "search_history" DROP CONSTRAINT "FK_d1ebf4101b2804213251e0a04d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryouts" DROP CONSTRAINT "FK_91569c1f051b3dfcd633ed67760"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryouts" DROP CONSTRAINT "FK_2f2ba700586da04b36838e89e7a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" DROP CONSTRAINT "FK_43a5b45072787a0e1f09d9927fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" DROP CONSTRAINT "FK_c3a97cface66e060976f19bb9a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" DROP CONSTRAINT "FK_eaac8582bed6bdf262a8248fc4e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "options" DROP CONSTRAINT "FK_6d364369f4b09f53b5c4f83667c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "options" DROP CONSTRAINT "FK_2bdd03245b8cb040130fe16f21d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlists" DROP CONSTRAINT "FK_b5e6331a1a7d61c25d7a25cab8f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_576ad12dfb750f4eb166eca1d2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_28c0159d8d5cbca27380289e41"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_db37ddc475003359650c81b5e2"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tryout_status_enum_old" AS ENUM('draft', 'scheduled', 'published', 'archived')`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryouts" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryouts" ALTER COLUMN "status" TYPE "public"."tryout_status_enum_old" USING "status"::"text"::"public"."tryout_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryouts" ALTER COLUMN "status" SET DEFAULT 'draft'`,
    );
    await queryRunner.query(`DROP TYPE "public"."tryouts_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."tryout_status_enum_old" RENAME TO "tryout_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ALTER COLUMN "points" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."difficulty_enum_old" AS ENUM('easy', 'medium', 'hard')`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ALTER COLUMN "difficulty" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ALTER COLUMN "difficulty" TYPE "public"."difficulty_enum_old" USING "difficulty"::"text"::"public"."difficulty_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ALTER COLUMN "difficulty" SET DEFAULT 'medium'`,
    );
    await queryRunner.query(`DROP TYPE "public"."questions_difficulty_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."difficulty_enum_old" RENAME TO "difficulty_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ALTER COLUMN "order_number" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ALTER COLUMN "order_number" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" DROP COLUMN "scoringType"`,
    );
    await queryRunner.query(`DROP TYPE "public"."questions_scoringtype_enum"`);
    await queryRunner.query(`ALTER TABLE "options" DROP COLUMN "weight"`);
    await queryRunner.query(
      `ALTER TABLE "search_history" RENAME COLUMN "user_id" TO "userId"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ratings_user_id" ON "ratings" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ratings_rateable" ON "ratings" ("rateable_id", "rateable_type") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_search_history_query" ON "search_history" ("query") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_wishlists_user_id" ON "wishlists" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_wishlists_wishlistable" ON "wishlists" ("wishlistable_id", "wishlistable_type") `,
    );
    await queryRunner.query(
      `ALTER TABLE "ratings" ADD CONSTRAINT "FK_ratings_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "search_history" ADD CONSTRAINT "FK_search_history_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryouts" ADD CONSTRAINT "FK_cf9272b0844e4b81db87d21371a" FOREIGN KEY ("cover_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tryouts" ADD CONSTRAINT "FK_0d119c970ca64e8924346fd4b0d" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD CONSTRAINT "FK_ab33e4014e9801b146698451aff" FOREIGN KEY ("image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD CONSTRAINT "FK_31ca854db505e7492962c272a28" FOREIGN KEY ("tryout_id") REFERENCES "tryouts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD CONSTRAINT "FK_explanation_image" FOREIGN KEY ("explanation_image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "options" ADD CONSTRAINT "FK_686e68393d9bd9387ef3a54f0b6" FOREIGN KEY ("image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "options" ADD CONSTRAINT "FK_790cf6b252b5bb48cd8fc1d272b" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlists" ADD CONSTRAINT "FK_wishlists_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
