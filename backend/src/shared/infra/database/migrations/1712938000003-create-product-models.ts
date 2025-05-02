import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateProductModels1712938000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "product_models" (
        "id" UUID PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "category_id" UUID NOT NULL,
        "suggested_price" DECIMAL(10,2) NOT NULL,
        "description" TEXT,
        CONSTRAINT "fk_product_model_category" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "product_models";`)
  }
}
