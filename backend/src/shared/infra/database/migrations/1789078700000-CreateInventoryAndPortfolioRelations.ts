import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateInventoryAndPortfolioRelations1789078700000
  implements MigrationInterface
{
  name = 'CreateInventoryAndPortfolioRelations1789078700000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "inventory_products" (
        "reseller_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,
        "assigned_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_inventory_products" PRIMARY KEY ("reseller_id", "product_id"),
        CONSTRAINT "FK_inventory_products_inventory" FOREIGN KEY ("reseller_id") REFERENCES "inventories"("reseller_id") ON DELETE CASCADE,
        CONSTRAINT "FK_inventory_products_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT
      )
    `)
    await queryRunner.query(
      `CREATE INDEX "IDX_inventory_products_product_id" ON "inventory_products" ("product_id")`
    )
    await queryRunner.query(`
      INSERT INTO "inventory_products" ("reseller_id", "product_id")
      SELECT inventory.reseller_id, inventory_product.product_id
      FROM "inventories" inventory
      CROSS JOIN LATERAL unnest(inventory.product_ids) AS inventory_product(product_id)
      ON CONFLICT DO NOTHING
    `)

    await queryRunner.query(`
      CREATE TABLE "customer_portfolio_customers" (
        "portfolio_id" uuid NOT NULL,
        "customer_id" uuid NOT NULL,
        "assigned_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_customer_portfolio_customers" PRIMARY KEY ("portfolio_id", "customer_id"),
        CONSTRAINT "FK_customer_portfolio_customers_portfolio" FOREIGN KEY ("portfolio_id") REFERENCES "customer_portfolios"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_customer_portfolio_customers_customer" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE
      )
    `)
    await queryRunner.query(
      `CREATE INDEX "IDX_customer_portfolio_customers_customer_id" ON "customer_portfolio_customers" ("customer_id")`
    )
    await queryRunner.query(`
      INSERT INTO "customer_portfolio_customers" ("portfolio_id", "customer_id")
      SELECT portfolio.id, portfolio_customer.customer_id
      FROM "customer_portfolios" portfolio
      CROSS JOIN LATERAL unnest(portfolio."customerIds") AS portfolio_customer(customer_id)
      ON CONFLICT DO NOTHING
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_customer_portfolio_customers_customer_id"`
    )
    await queryRunner.query(`DROP TABLE "customer_portfolio_customers"`)
    await queryRunner.query(`DROP INDEX "IDX_inventory_products_product_id"`)
    await queryRunner.query(`DROP TABLE "inventory_products"`)
  }
}
