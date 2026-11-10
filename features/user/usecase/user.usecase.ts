import { IUserRepository } from "./user.repository.interface";

export async function getCurrentUserUseCase(repo: IUserRepository) {
    return repo.getCurrentUser()
}