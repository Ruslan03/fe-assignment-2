import { UserType } from "../domain/user.entity";

export interface IUserRepository {
    getCurrentUser: () => Promise<UserType>
}