import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
} from "typeorm";

export class CreateSpecificationsCars1622487071065
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "specifications_cars",
                columns: [
                    {
                        name: "car_id",
                        type: "uuid",
                    },
                    {
                        name: "specification_id",
                        type: "uuid",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            })
        );

        await queryRunner.createForeignKey(
            "specifications_cars",
            new TableForeignKey({
                name: "FKSpecificationCar",
                referencedTableName: "specifications", // tabela pai
                referencedColumnNames: ["id"], // coluna id de category
                columnNames: ["specification_id"],
                onDelete: "SET NULL", // quando meu pai sofrer alteraçao
                onUpdate: "SET NULL",
            })
        );
        await queryRunner.createForeignKey(
            "specifications_cars",
            new TableForeignKey({
                name: "FKSCarSpecification",
                referencedTableName: "cars", // tabela pai
                referencedColumnNames: ["id"], // coluna id de category
                columnNames: ["car_id"],
                onDelete: "SET NULL", // quando meu pai sofrer alteraçao
                onUpdate: "SET NULL",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
            "specifications_cars",
            "FKSCarSpecification"
        );
        await queryRunner.dropForeignKey(
            "specifications_cars",
            "FKSpecificationCar"
        );
        await queryRunner.dropTable("specifications_cars");
    }
}
