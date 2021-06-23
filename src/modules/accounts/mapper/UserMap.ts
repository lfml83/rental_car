import { classToClass } from "class-transformer"; // para poder usar o GetUURL em user.ts

import { IUserResponseDTO } from "../dtos/IUserResponseDTO";
import { User } from "../infra/typeorm/entities/User";

class UserMap {
    static toDTO({
        email,
        name,
        id,
        avatar,
        driver_license,
        avatar_url,
    }: User): IUserResponseDTO {
        const user = classToClass({
            // isso é para colocar a url
            email,
            name,
            id,
            avatar,
            driver_license,
            avatar_url,
        });

        return user;
    }
}
export { UserMap };

// usando assim nao vou precisar usar new UserMap() usando Static
