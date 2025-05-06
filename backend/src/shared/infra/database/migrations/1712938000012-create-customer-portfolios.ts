import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCustomerPortfolios1712938000012
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "customer_portfolios" (
        "reseller_id" UUID PRIMARY KEY,
        "customer_ids" JSONB NOT NULL,
        CONSTRAINT "fk_customer_portfolio_reseller" FOREIGN KEY ("reseller_id") REFERENCES "users"("id") ON DELETE RESTRICT
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "customer_portfolios";`)
  }
}
