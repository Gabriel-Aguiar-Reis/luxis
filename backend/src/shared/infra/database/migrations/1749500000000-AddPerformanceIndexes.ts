import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddPerformanceIndexes1749500000000 implements MigrationInterface {
  name = 'AddPerformanceIndexes1749500000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_users_role" ON "users" ("role")`
    )
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_users_status" ON "users" ("status")`
    )
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_products_batch_id" ON "products" ("batch_id")`
    )
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_products_model_id" ON "products" ("model_id")`
    )
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_products_status" ON "products" ("status")`
    )
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_sales_reseller_id" ON "sales" ("reseller_id")`
    )
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_sales_status" ON "sales" ("status")`
    )
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_sales_sale_date" ON "sales" ("sale_date")`
    )
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_shipments_reseller_id" ON "shipments" ("reseller_id")`
    )
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_shipments_status" ON "shipments" ("status")`
    )
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_returns_reseller_id" ON "returns" ("reseller_id")`
    )
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_returns_status" ON "returns" ("status")`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_returns_status"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_returns_reseller_id"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_shipments_status"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_shipments_reseller_id"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_sales_sale_date"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_sales_status"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_sales_reseller_id"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_products_status"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_products_model_id"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_products_batch_id"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_status"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_role"`)
  }
}
