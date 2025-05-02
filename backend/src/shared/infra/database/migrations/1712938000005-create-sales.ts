import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateSales1712938000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "sales" (
        "id" UUID PRIMARY KEY,
        "reseller_id" UUID NOT NULL,
        "product_ids" JSONB NOT NULL,
        "sale_date" DATE NOT NULL,
        "total_amount" DECIMAL(10,2) NOT NULL,
        CONSTRAINT "fk_sale_reseller" FOREIGN KEY ("reseller_id") REFERENCES "users"("id") ON DELETE RESTRICT
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "sales";`)
  }
}
