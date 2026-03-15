import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWishlistsTable1773301800000 implements MigrationInterface {
  name = 'CreateWishlistsTable1773301800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "wishlists" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "wishlistable_id" uuid NOT NULL,
        "wishlistable_type" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "user_id" uuid,
        CONSTRAINT "PK_wishlists_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_wishlists_wishlistable" ON "wishlists" ("wishlistable_id", "wishlistable_type")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_wishlists_user_id" ON "wishlists" ("user_id")
    `);
    await queryRunner.query(`
      ALTER TABLE "wishlists" ADD CONSTRAINT "FK_wishlists_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wishlists" DROP CONSTRAINT "FK_wishlists_user_id"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_wishlists_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_wishlists_wishlistable"`);
    await queryRunner.query(`DROP TABLE "wishlists"`);
  }
}
