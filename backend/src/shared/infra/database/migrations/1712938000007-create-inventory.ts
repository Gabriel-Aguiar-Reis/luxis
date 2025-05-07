import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateInventory1712938000007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "inventories" (
        "reseller_id" UUID PRIMARY KEY,
        "product_ids" JSONB NOT NULL,
        CONSTRAINT "fk_inventory_reseller" FOREIGN KEY ("reseller_id") REFERENCES "users"("id") ON DELETE RESTRICT
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "inventories";`)
  }
}
