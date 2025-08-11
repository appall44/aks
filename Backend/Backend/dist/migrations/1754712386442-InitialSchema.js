"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1754707844855 = void 0;
class InitialSchema1754707844855 {
    async up(queryRunner) {
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
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "units"`);
    }
}
exports.InitialSchema1754707844855 = InitialSchema1754707844855;
//# sourceMappingURL=1754712386442-InitialSchema.js.map