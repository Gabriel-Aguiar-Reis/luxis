import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateBatches1712938000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "batches" (
        "id" UUID PRIMARY KEY,
        "arrival_date" DATE NOT NULL,
        "supplier_id" UUID NOT NULL,
        "items" JSONB NOT NULL,
        CONSTRAINT "fk_batch_supplier" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "batches";`)
  }
}
