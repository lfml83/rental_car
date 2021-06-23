import { inject, injectable } from "tsyringe";

import { ICarsImagesRepository } from "@modules/cars/repositories/ICarsImagesRepository";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";

interface IRequest {
    car_id: string;
    images_name: string[];
}

@injectable()
class UploadImagesCarUseCase {
    constructor(
        @inject("CarsImagesRepository")
        private carsImagesRepository: ICarsImagesRepository,
        @inject("StorageProvider")
        private storageProvider: IStorageProvider
    ) {}

    async execute({ car_id, images_name }: IRequest): Promise<void> {
        images_name.map(async (image) => {
            // pegar imagem por imagem ja que é um array

            await this.carsImagesRepository.create(car_id, image);
            await this.storageProvider.save(image, "cars"); // imagem e pasta
        });
    }
}

export { UploadImagesCarUseCase };
