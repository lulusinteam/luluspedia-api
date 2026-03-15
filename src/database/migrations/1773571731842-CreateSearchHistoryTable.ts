import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSearchHistoryTable1773571731842
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "search_history" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "query" character varying NOT NULL,
                "userId" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_search_history" PRIMARY KEY ("id"),
                CONSTRAINT "FK_search_history_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL
            )
        `);
    await queryRunner.query(
      `CREATE INDEX "IDX_search_history_query" ON "search_history" ("query")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_search_history_query"`);
    await queryRunner.query(`DROP TABLE "search_history"`);
  }
}
