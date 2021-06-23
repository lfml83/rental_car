import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity("categories")
class Category {
    @PrimaryColumn()
    id?: string; // significa que é opcional

    @Column()
    name: string;

    @Column()
    description: string;

    @CreateDateColumn()
    created_at: Date;

    constructor() {
        if (!this.id) {
            // a obrigaçao de dar o ID fica com o construtor
            this.id = uuidV4();
        }
    }
}
export { Category };
