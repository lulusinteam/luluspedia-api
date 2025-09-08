import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTableNamesAndColumns1757305800000
  implements MigrationInterface
{
  name = 'UpdateTableNamesAndColumns1757305800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename tables to plural form
    await queryRunner.query(`ALTER TABLE "role" RENAME TO "roles"`);
    await queryRunner.query(`ALTER TABLE "status" RENAME TO "statuses"`);
    await queryRunner.query(`ALTER TABLE "file" RENAME TO "files"`);
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "users"`);
    await queryRunner.query(`ALTER TABLE "session" RENAME TO "sessions"`);

    // Update foreign key constraints for renamed tables
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_dc18daa696860586ba4667a9d31"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );

    // Add new foreign key constraints with updated table names
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f" FOREIGN KEY ("photoId") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_dc18daa696860586ba4667a9d31" FOREIGN KEY ("statusId") REFERENCES "statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // Rename columns to snake_case in users table
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "firstName" TO "first_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "lastName" TO "last_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "socialId" TO "social_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "updatedAt" TO "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "deletedAt" TO "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "photoId" TO "photo_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "roleId" TO "role_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "statusId" TO "status_id"`,
    );

    // Rename columns to snake_case in sessions table
    await queryRunner.query(
      `ALTER TABLE "sessions" RENAME COLUMN "createdAt" TO "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" RENAME COLUMN "updatedAt" TO "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" RENAME COLUMN "deletedAt" TO "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" RENAME COLUMN "userId" TO "user_id"`,
    );

    // Update indexes for renamed columns
    await queryRunner.query(`DROP INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f"`);
    await queryRunner.query(`DROP INDEX "IDX_58e4dbff0e1a32a9bdc861bb29"`);
    await queryRunner.query(`DROP INDEX "IDX_f0e1b4ecdca13b177e2e3a0613"`);
    await queryRunner.query(`DROP INDEX "IDX_3d2f174ef04fb312fdebd0ddc5"`);

    // Create new indexes for renamed columns
    await queryRunner.query(
      `CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "users" ("social_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "users" ("first_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "users" ("last_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "sessions" ("user_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert indexes
    await queryRunner.query(`DROP INDEX "IDX_3d2f174ef04fb312fdebd0ddc5"`);
    await queryRunner.query(`DROP INDEX "IDX_f0e1b4ecdca13b177e2e3a0613"`);
    await queryRunner.query(`DROP INDEX "IDX_58e4dbff0e1a32a9bdc861bb29"`);
    await queryRunner.query(`DROP INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f"`);

    // Recreate original indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "sessions" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "users" ("lastName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "users" ("firstName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "users" ("socialId") `,
    );

    // Revert column names in sessions table
    await queryRunner.query(
      `ALTER TABLE "sessions" RENAME COLUMN "user_id" TO "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" RENAME COLUMN "deleted_at" TO "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" RENAME COLUMN "updated_at" TO "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" RENAME COLUMN "created_at" TO "createdAt"`,
    );

    // Revert column names in users table
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "status_id" TO "statusId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "role_id" TO "roleId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "photo_id" TO "photoId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "deleted_at" TO "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "updated_at" TO "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "created_at" TO "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "social_id" TO "socialId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "last_name" TO "lastName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "first_name" TO "firstName"`,
    );

    // Drop foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_dc18daa696860586ba4667a9d31"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f"`,
    );

    // Add back original foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_dc18daa696860586ba4667a9d31" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // Rename tables back to singular form
    await queryRunner.query(`ALTER TABLE "sessions" RENAME TO "session"`);
    await queryRunner.query(`ALTER TABLE "users" RENAME TO "user"`);
    await queryRunner.query(`ALTER TABLE "files" RENAME TO "file"`);
    await queryRunner.query(`ALTER TABLE "statuses" RENAME TO "status"`);
    await queryRunner.query(`ALTER TABLE "roles" RENAME TO "role"`);
  }
}
