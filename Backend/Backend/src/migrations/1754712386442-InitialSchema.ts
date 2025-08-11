import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1754707844855 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE "units" (
        "id" SERIAL NOT NULL,
        "unitNumber" character varying NOT NULL,
        "unitType" character varying NOT NULL,
        "size" integer,
        "bedrooms" integer,
        "bathrooms" integer,
        "monthlyRent" integer,
        "status" character varying,
        "description" text,
        "images" text ARRAY,
        "propertyId" integer,
        CONSTRAINT "PK_..." PRIMARY KEY ("id"),
        CONSTRAINT "FK_..." FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE
      )
    `);
		// Other table creations (e.g., properties, leases, etc.)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "units"`);
		// Drop other tables
	}
}
