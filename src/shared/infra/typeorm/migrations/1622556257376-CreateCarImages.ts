import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCarImages1622556257376 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "cars_image",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "car_id",
                        type: "uuid",
                    },
                    {
                        name: "image_name",
                        type: "varchar",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
                foreignKeys: [
                    {
                        name: "FKCarImage",
                        referencedTableName: "cars", // tabela pai
                        referencedColumnNames: ["id"], // coluna id de category
                        columnNames: ["car_id"],
                        onDelete: "SET NULL", // quando meu pai sofrer alteraçao
                        onUpdate: "SET NULL",
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("cars_image");
    }
}
