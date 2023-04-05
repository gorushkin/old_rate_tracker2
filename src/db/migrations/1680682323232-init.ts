import { MigrationInterface, QueryRunner } from "typeorm";

export class init1680682323232 implements MigrationInterface {
    name = 'init1680682323232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY NOT NULL,
                "firstName" varchar NOT NULL,
                "username" varchar NOT NULL
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "user"
        `);
    }

}
