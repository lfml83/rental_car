import { ICreateCarDTO } from "../dtos/ICreateCarDTO";
import { Car } from "../infra/typeorm/entities/Car";

interface ICarsRepository {
    create(data: ICreateCarDTO): Promise<Car>;
    findByLicensePlate(license_plate: string): Promise<Car>;
    findAvailable(
        brand?: string, // significa que é opcional
        category_id?: string,
        name?: string
    ): Promise<Car[]>;
    findById(id: string): Promise<Car>;
    updateAvailable(id: string, available: boolean): Promise<void>;
}

export { ICarsRepository };