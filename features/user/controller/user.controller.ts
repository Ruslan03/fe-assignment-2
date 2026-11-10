import { UserService } from "../infrastructure/api/user.service"
import { getCurrentUserUseCase } from "../usecase/user.usecase"

export async function getCurentUserController() {
    const repo = new UserService()

    return getCurrentUserUseCase(repo)
}