import { UsersRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";

import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoyInMemory: UsersRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let usersTokensRepositoryInMemmory: UsersTokensRepositoryInMemory;
let mailProvider: MailProviderInMemory;

describe("Send Forgot Mail", () => {
    beforeEach(() => {
        usersRepositoyInMemory = new UsersRepositoryInMemory();
        dateProvider = new DayjsDateProvider();
        usersTokensRepositoryInMemmory = new UsersTokensRepositoryInMemory();
        mailProvider = new MailProviderInMemory();

        sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
            usersRepositoyInMemory,
            usersTokensRepositoryInMemmory,
            dateProvider,
            mailProvider
        );
    });
    it("should be able to send a forgot password mail to user", async () => {
        const sendMail = jest.spyOn(mailProvider, "sendMail"); // espia para ver se a funçao foi chamada

        await usersRepositoyInMemory.create({
            driver_license: "064959",
            email: "wuzi@ibi.mp",
            name: "Rose Briggs",
            password: "1234",
        });

        await sendForgotPasswordMailUseCase.execute("wuzi@ibi.mp");

        expect(sendMail).toHaveBeenCalled(); // verificando se a funçao foi chamada pq essa funçao no memory nao sera usada
    });

    it("should not be able to send an email if use does not exists", async () => {
        await expect(
            sendForgotPasswordMailUseCase.execute("gokapute@vusna.et")
        ).rejects.toEqual(new AppError("Users does not exists!"));
    });
    it("shoul be able to create an users token", async () => {
        const generateTokenMail = jest.spyOn(
            usersTokensRepositoryInMemmory,
            "create"
        );

        await usersRepositoyInMemory.create({
            driver_license: "669744",
            email: "buhiwahec@ib.gov",
            name: "Delia Stephens",
            password: "1234",
        });

        await sendForgotPasswordMailUseCase.execute("buhiwahec@ib.gov");

        expect(generateTokenMail).toHaveBeenCalled();
    });
});
