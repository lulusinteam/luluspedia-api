import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrateToUuid1772845755656 implements MigrationInterface {
  name = 'MigrateToUuid1772845755656';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
    await queryRunner.query(
      `DROP INDEX "public"."IDX_58e4dbff0e1a32a9bdc861bb29"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f0e1b4ecdca13b177e2e3a0613"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9bd2fe7a8e694dedc4ec2f666f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d2f174ef04fb312fdebd0ddc5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2"`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "roles" ADD "id" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "statuses" DROP CONSTRAINT "PK_e12743a7086ec826733f54e1d95"`,
    );
    await queryRunner.query(`ALTER TABLE "statuses" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "statuses" ADD "id" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "statuses" ADD CONSTRAINT "PK_2fd3770acdb67736f1a3e3d5399" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role_id"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "role_id" uuid`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status_id"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "status_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11"`,
    );
    await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "sessions" ADD "user_id" uuid`);
    await queryRunner.query(
      `CREATE INDEX "IDX_24ed31edd4e42499a687467fdc" ON "users" ("social_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ef2fb839248017665e5033e730" ON "users" ("first_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0408cb491623b121499d4fa238" ON "users" ("last_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_085d540d9f418cfbdc7bd55bb1" ON "sessions" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_c15c1640c422bdab41e44a19d86" FOREIGN KEY ("photo_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_9d295cb2f8df33c080e23acfb8f" FOREIGN KEY ("status_id") REFERENCES "statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_9d295cb2f8df33c080e23acfb8f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_c15c1640c422bdab41e44a19d86"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_085d540d9f418cfbdc7bd55bb1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0408cb491623b121499d4fa238"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ef2fb839248017665e5033e730"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_24ed31edd4e42499a687467fdc"`,
    );
    await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "sessions" ADD "user_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT "PK_3238ef96f18b355b671619111bc"`,
    );
    await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD "id" integer NOT NULL DEFAULT nextval('session_id_seq')`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status_id"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "status_id" integer`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role_id"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "role_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "id" integer NOT NULL DEFAULT nextval('user_id_seq')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "statuses" DROP CONSTRAINT "PK_2fd3770acdb67736f1a3e3d5399"`,
    );
    await queryRunner.query(`ALTER TABLE "statuses" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "statuses" ADD "id" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "statuses" ADD CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "PK_c1433d71a4838793a49dcad46ab"`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "roles" ADD "id" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "sessions" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "users" ("social_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "users" ("last_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "users" ("first_name") `,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_dc18daa696860586ba4667a9d31" FOREIGN KEY ("status_id") REFERENCES "statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f" FOREIGN KEY ("photo_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
