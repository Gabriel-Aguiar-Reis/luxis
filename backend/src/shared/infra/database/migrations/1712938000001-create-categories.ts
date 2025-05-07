import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCategories1712938000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" UUID PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "description" TEXT,
        "status" VARCHAR NOT NULL
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "categories";`)
  }
}
