import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUsers1712938000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" UUID PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "surName" VARCHAR NOT NULL,
        "phone" VARCHAR NOT NULL,
        "email" VARCHAR NOT NULL UNIQUE,
        "password" VARCHAR NOT NULL,
        "role" VARCHAR NOT NULL,
        "residence" VARCHAR NOT NULL,
        "status" VARCHAR NOT NULL
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users";`)
  }
}
