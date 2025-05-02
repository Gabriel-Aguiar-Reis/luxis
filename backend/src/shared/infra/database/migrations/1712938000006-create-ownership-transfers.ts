import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateOwnershipTransfers1712938000006
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "ownership_transfers" (
        "id" UUID PRIMARY KEY,
        "product_id" UUID NOT NULL,
        "from_reseller_id" UUID NOT NULL,
        "to_reseller_id" UUID NOT NULL,
        "transfer_date" DATE NOT NULL,
        "status" VARCHAR NOT NULL,
        CONSTRAINT "fk_transfer_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT,
        CONSTRAINT "fk_transfer_from_reseller" FOREIGN KEY ("from_reseller_id") REFERENCES "users"("id") ON DELETE RESTRICT,
        CONSTRAINT "fk_transfer_to_reseller" FOREIGN KEY ("to_reseller_id") REFERENCES "users"("id") ON DELETE RESTRICT
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "ownership_transfers";`)
  }
}
