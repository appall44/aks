"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUniqueConstraintToUnit1698765432100 = void 0;
class AddUniqueConstraintToUnit1698765432100 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE UNIQUE INDEX unit_propertyId_unitNumber_unique ON units (propertyId, unitNumber)`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX unit_propertyId_unitNumber_unique ON units`);
    }
}
exports.AddUniqueConstraintToUnit1698765432100 = AddUniqueConstraintToUnit1698765432100;
//# sourceMappingURL=1754707844855-AddUniqueConstraintToUnit.js.map