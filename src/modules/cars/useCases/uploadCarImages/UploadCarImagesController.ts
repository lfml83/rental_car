import { Request, Response } from "express";
import { container } from "tsyringe";

import { UploadImagesCarUseCase } from "./UploadCarImagesUseCase";

interface IFiles {
    filename: string;
}

class UploadCarImagesController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const images = request.files as IFiles[]; // colocar esse nome na rota

        const uploadCarImageUseCase = container.resolve(UploadImagesCarUseCase);

        const images_name = images.map((file) => file.filename); // pegar cada foto

        await uploadCarImageUseCase.execute({
            car_id: id,
            images_name,
        });

        return response.status(201).send();
    }
}

export { UploadCarImagesController };
