import { CategoriesRepositoryInMemory } from "@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;
describe("Create Category", () => {
    beforeEach(() => {
        // antes de algum teste ele vai fazer determinada função
        categoriesRepositoryInMemory = new CategoriesRepositoryInMemory(); // cirando na memoria
        createCategoryUseCase = new CreateCategoryUseCase(
            categoriesRepositoryInMemory
        );
    });

    // teste unitario nao tem responsabilidade de testar banco de dados
    it("should be able to create a new category", async () => {
        const category = {
            name: "Category Test",
            description: "Category description Test",
        };

        await createCategoryUseCase.execute({
            name: category.name,
            description: category.description,
        });
        const categotyCreated = await categoriesRepositoryInMemory.findByName(
            category.name
        );
        // se nossa categoria fpi criada com sucessp ela vai ter criado um ID

        expect(categotyCreated).toHaveProperty("id");
    });
    it("should not be able to create a new category with name exists", async () => {
        const category = {
            name: "Category Test",
            description: "Category description Test",
        };

        await createCategoryUseCase.execute({
            name: category.name,
            description: category.description,
        });
        await expect(
            createCategoryUseCase.execute({
                // recriando o msm dado
                name: category.name,
                description: category.description,
            })
        ).rejects.toEqual(new AppError("Caterogy already exists!"));
    });
});
