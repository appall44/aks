import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueConstraintToUnit1698765432100
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE UNIQUE INDEX unit_propertyId_unitNumber_unique ON units (propertyId, unitNumber)`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DROP INDEX unit_propertyId_unitNumber_unique ON units`
		);
	}
}
