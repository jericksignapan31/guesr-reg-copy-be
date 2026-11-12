import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddSignatureToUsers1786323432421 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("users");
        const columnExists = table?.columns.find(col => col.name === "signature");

        if (!columnExists) {
            await queryRunner.addColumn(
                "users",
                new TableColumn({
                    name: "signature",
                    type: "text",
                    isNullable: true,
                }),
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("users");
        const columnExists = table?.columns.find(col => col.name === "signature");

        if (columnExists) {
            await queryRunner.dropColumn("users", "signature");
        }
    }

}
