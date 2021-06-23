import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUsecase } from "./AuthenticateUserUsecase";

let authenticateUserUserCase: AuthenticateUserUsecase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUsecase: CreateUserUseCase;
let usersTokensRepositoryInMemmory: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;

describe("Authenticate User", () => {
    beforeEach(() => {
        // cirando na memoria
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        usersTokensRepositoryInMemmory = new UsersTokensRepositoryInMemory();
        dateProvider = new DayjsDateProvider();
        authenticateUserUserCase = new AuthenticateUserUsecase(
            usersRepositoryInMemory,
            usersTokensRepositoryInMemmory,
            dateProvider
        );
        createUserUsecase = new CreateUserUseCase(usersRepositoryInMemory);
    });
    it("should be able to authenticate an user", async () => {
        // colocando os dados na memoria
        const user: ICreateUserDTO = {
            driver_license: "000123",
            email: "user@test.com",
            password: "1234",
            name: "User Test",
        };
        await createUserUsecase.execute(user);

        const result = await authenticateUserUserCase.execute({
            email: user.email,
            password: user.password,
        });
        expect(result).toHaveProperty("token");
    });
    it("should not be able to authenticate a nonexistent user", async () => {
        await expect(
            authenticateUserUserCase.execute({
                email: "false@email.com",
                password: "1234",
            })
        ).rejects.toEqual(new AppError("Email or password incorrect"));
    });

    it("should not be able to authentica with incorrect password", async () => {
        const user: ICreateUserDTO = {
            driver_license: "9999",
            email: "user@user.com",
            password: "1234",
            name: "User test Error",
        };
        await createUserUsecase.execute(user);

        await expect(
            authenticateUserUserCase.execute({
                email: user.email,
                password: "incorretPassword",
            })
        ).rejects.toEqual(new AppError("Email or password incorrect"));
    });
});
