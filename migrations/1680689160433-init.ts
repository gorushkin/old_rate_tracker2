import { MigrationInterface, QueryRunner } from "typeorm";

export class init1680689160433 implements MigrationInterface {
    name = 'init1680689160433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "currency" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar NOT NULL,
                CONSTRAINT "UQ_77f11186dd58a8d87ad5fff0246" UNIQUE ("name"),
                CONSTRAINT "UQ_77f11186dd58a8d87ad5fff0246" UNIQUE ("name")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY NOT NULL,
                "firstName" varchar NOT NULL,
                "username" varchar NOT NULL,
                "role" varchar NOT NULL,
                "defaultCurrencyId" integer
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_currencies_currency" (
                "userId" integer NOT NULL,
                "currencyId" integer NOT NULL,
                PRIMARY KEY ("userId", "currencyId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_bd81b2c36b8983bfd9112fd025" ON "user_currencies_currency" ("userId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_54dd128f6089407b1deab58e94" ON "user_currencies_currency" ("currencyId")
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_user" (
                "id" integer PRIMARY KEY NOT NULL,
                "firstName" varchar NOT NULL,
                "username" varchar NOT NULL,
                "role" varchar NOT NULL,
                "defaultCurrencyId" integer,
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
        await queryRunner.query(`
            DROP INDEX "IDX_bd81b2c36b8983bfd9112fd025"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_54dd128f6089407b1deab58e94"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_user_currencies_currency" (
                "userId" integer NOT NULL,
                "currencyId" integer NOT NULL,
                CONSTRAINT "FK_bd81b2c36b8983bfd9112fd0250" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "FK_54dd128f6089407b1deab58e94b" FOREIGN KEY ("currencyId") REFERENCES "currency" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                PRIMARY KEY ("userId", "currencyId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_user_currencies_currency"("userId", "currencyId")
            SELECT "userId",
                "currencyId"
            FROM "user_currencies_currency"
        `);
        await queryRunner.query(`
            DROP TABLE "user_currencies_currency"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_user_currencies_currency"
                RENAME TO "user_currencies_currency"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_bd81b2c36b8983bfd9112fd025" ON "user_currencies_currency" ("userId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_54dd128f6089407b1deab58e94" ON "user_currencies_currency" ("currencyId")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "IDX_54dd128f6089407b1deab58e94"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_bd81b2c36b8983bfd9112fd025"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_currencies_currency"
                RENAME TO "temporary_user_currencies_currency"
        `);
        await queryRunner.query(`
            CREATE TABLE "user_currencies_currency" (
                "userId" integer NOT NULL,
                "currencyId" integer NOT NULL,
                PRIMARY KEY ("userId", "currencyId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "user_currencies_currency"("userId", "currencyId")
            SELECT "userId",
                "currencyId"
            FROM "temporary_user_currencies_currency"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_user_currencies_currency"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_54dd128f6089407b1deab58e94" ON "user_currencies_currency" ("currencyId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_bd81b2c36b8983bfd9112fd025" ON "user_currencies_currency" ("userId")
        `);
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
                "defaultCurrencyId" integer
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
        await queryRunner.query(`
            DROP INDEX "IDX_54dd128f6089407b1deab58e94"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_bd81b2c36b8983bfd9112fd025"
        `);
        await queryRunner.query(`
            DROP TABLE "user_currencies_currency"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            DROP TABLE "currency"
        `);
    }

}
