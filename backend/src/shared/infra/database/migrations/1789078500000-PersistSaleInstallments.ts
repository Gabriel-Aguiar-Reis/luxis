import { MigrationInterface, QueryRunner } from 'typeorm'

export class PersistSaleInstallments1789078500000
  implements MigrationInterface
{
  name = 'PersistSaleInstallments1789078500000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sales" ADD "installments" text`)
    await queryRunner.query(`
      UPDATE "sales"
      SET "installments" = COALESCE(
        (
          SELECT json_agg(installment <= "sales"."installments_paid")::text
          FROM generate_series(1, "sales"."number_installments") AS installment
        ),
        '[]'
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sales" DROP COLUMN "installments"`)
  }
}
