import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCustomerPortfolios1712938000012
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "customer_portfolios" (
        "id" UUID PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "phone" VARCHAR NOT NULL,
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "customer_portfolios";`)
  }
}
