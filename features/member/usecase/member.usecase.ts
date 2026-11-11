import { IMemberRepository } from "./member.repository.interface";

export async function getAllMembersUseCase(repo: IMemberRepository, search?: string) {
    return repo.getAllMembers(search)
}