import csvParse from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { ICategoriesRepository } from "@modules/cars/repositories/ICategoriesRepository";

interface IImportCategory {
    name: string;
    description: string;
}
@injectable()
class ImportCategoryUseCase {
    constructor(
        @inject("CategoriesRepository")
        private categoryRepository: ICategoriesRepository
    ) {}

    loadCategories(file: Express.Multer.File): Promise<IImportCategory[]> {
        return new Promise((resolve, reject) => {
            const stream = fs.createReadStream(file.path); // ele precisa do caminho do arquivo e cria streaming de leitura
            const categories: IImportCategory[] = [];

            const parseFile = csvParse();

            stream.pipe(parseFile); // pega oq esta lido e joga ele no lugar que determinarmos, no caso ele joga no parseFile - é oq faz a  leitura do CSV

            parseFile
                .on("data", async (line) => {
                    // lendo as linhas

                    // ["name","description"]
                    const [name, description] = line;
                    categories.push({
                        name,
                        description,
                    });
                })
                .on("end", () => {
                    fs.promises.unlink(file.path); // tira arquivo da pasta
                    resolve(categories);
                }) // esse on significa quando o parse esta finalizado, como essa é uma função assincrona teve que colocar dentro de uma promisse
                .on("error", (err) => {
                    reject(err);
                });
        });
    }

    async execute(file: Express.Multer.File): Promise<void> {
        const categories = await this.loadCategories(file); // ele vai esperar terminar a prommisse para chamar

        categories.map(async (category) => {
            // o map tem que ser assincrono
            const { name, description } = category;

            const existCategory = await this.categoryRepository.findByName(
                name
            );

            if (!existCategory) {
                await this.categoryRepository.create({
                    name,
                    description,
                });
            }
        });
    }
}

export { ImportCategoryUseCase };
