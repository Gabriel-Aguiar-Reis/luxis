import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateReturns1712938000010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "returns" (
        "id" UUID PRIMARY KEY,
        "reseller_id" UUID NOT NULL,
        "items" UUID[] NOT NULL,
        "status" VARCHAR NOT NULL,
        CONSTRAINT "fk_return_reseller" FOREIGN KEY ("reseller_id") REFERENCES "users"("id") ON DELETE RESTRICT
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "returns";`)
  }
}
