import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCustomers1712938000011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "customers" (
        "id" UUID PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "phone" VARCHAR NOT NULL
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "customers";`)
  }
}
