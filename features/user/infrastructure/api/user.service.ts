import { UserType } from "../../domain/user.entity";
import { IUserRepository } from "../../usecase/user.repository.interface";

export class UserService implements IUserRepository {
    async getCurrentUser(): Promise<UserType> {
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/users/me`
        const res = await fetch(url)

        const data = await res.json()

        return data?.data as UserType
    };
}