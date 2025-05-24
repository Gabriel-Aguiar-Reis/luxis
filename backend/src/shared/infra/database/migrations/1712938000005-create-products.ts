import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateProducts1712938000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" UUID PRIMARY KEY,
        "serial_number" VARCHAR NOT NULL,
        "model_id" UUID NOT NULL,
        "batch_id" UUID NOT NULL,
        "unit_cost" DECIMAL(10,2) NOT NULL,
        "sale_price" DECIMAL(10,2) NOT NULL,
        "status" VARCHAR NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "fk_product_model" FOREIGN KEY ("model_id") REFERENCES "product_models"("id") ON DELETE RESTRICT,
        CONSTRAINT "fk_product_batch" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE CASCADE
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "products";`)
  }
}
