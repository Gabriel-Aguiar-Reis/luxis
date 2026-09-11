import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateSaleProducts1789078600000 implements MigrationInterface {
  name = 'CreateSaleProducts1789078600000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "sale_products" (
        "sale_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,
        "position" integer NOT NULL,
        CONSTRAINT "PK_sale_products" PRIMARY KEY ("sale_id", "product_id"),
        CONSTRAINT "FK_sale_products_sale" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_sale_products_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT
      )
    `)
    await queryRunner.query(
      `CREATE INDEX "IDX_sale_products_product_id" ON "sale_products" ("product_id")`
    )
    await queryRunner.query(`
      INSERT INTO "sale_products" ("sale_id", "product_id", "position")
      SELECT sale.id, sold_product.product_id, sold_product.position - 1
      FROM "sales" sale
      CROSS JOIN LATERAL unnest(sale.product_ids) WITH ORDINALITY AS sold_product(product_id, position)
      ON CONFLICT DO NOTHING
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_sale_products_product_id"`)
    await queryRunner.query(`DROP TABLE "sale_products"`)
  }
}
