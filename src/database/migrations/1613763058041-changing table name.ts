import {MigrationInterface, QueryRunner} from "typeorm";

export class changingTableName1613763058041 implements MigrationInterface {
    name = 'changingTableName1613763058041'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_aa79448dc3e959720ab4c13651d" UNIQUE ("title"), CONSTRAINT "PK_a91838c72cb5859b87bf116cfca" PRIMARY KEY ("id", "title"))`, undefined);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" text NOT NULL, "type" text NOT NULL, "value" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "category_id" text, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_c9e41213ca42d50132ed7ab2b0f" FOREIGN KEY ("category_id") REFERENCES "categories"("title") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_c9e41213ca42d50132ed7ab2b0f"`, undefined);
        await queryRunner.query(`DROP TABLE "transactions"`, undefined);
        await queryRunner.query(`DROP TABLE "categories"`, undefined);
    }

}
