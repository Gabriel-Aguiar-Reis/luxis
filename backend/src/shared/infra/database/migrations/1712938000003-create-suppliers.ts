import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateSuppliers1712938000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "suppliers" (
        "id" UUID PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "phone" VARCHAR NOT NULL
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "suppliers";`)
  }
}
