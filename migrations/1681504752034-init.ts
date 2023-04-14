import { MigrationInterface, QueryRunner } from "typeorm";

export class userTimezone1681504752034 implements MigrationInterface {
    name = 'userTimezone1681504752034'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "temporary_user" (
                "id" integer PRIMARY KEY NOT NULL,
                "firstName" varchar NOT NULL,
                "username" varchar NOT NULL,
                "role" varchar NOT NULL,
                "defaultCurrencyId" integer,
                "timeZoneOffset" varchar NOT NULL,
                CONSTRAINT "FK_4a7358f0ad5bd992899c8c6f7cf" FOREIGN KEY ("defaultCurrencyId") REFERENCES "currency" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_user"(
                    "id",
                    "firstName",
                    "username",
                    "role",
                    "defaultCurrencyId"
                )
            SELECT "id",
                "firstName",
                "username",
                "role",
                "defaultCurrencyId"
            FROM "user"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_user"
                RENAME TO "user"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
                RENAME TO "temporary_user"
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY NOT NULL,
                "firstName" varchar NOT NULL,
                "username" varchar NOT NULL,
                "role" varchar NOT NULL,
                "defaultCurrencyId" integer,
                CONSTRAINT "FK_4a7358f0ad5bd992899c8c6f7cf" FOREIGN KEY ("defaultCurrencyId") REFERENCES "currency" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "user"(
                    "id",
                    "firstName",
                    "username",
                    "role",
                    "defaultCurrencyId"
                )
            SELECT "id",
                "firstName",
                "username",
                "role",
                "defaultCurrencyId"
            FROM "temporary_user"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_user"
        `);
    }

}
