import { CreateMemberPayload } from "../domain/member.entity"
import { IMemberRepository } from "./member.repository.interface"

export async function getAllMembersUseCase(repo: IMemberRepository, search?: string) {
    return repo.getAllMembers(search)
}

export async function createMemberUseCase(
    repo: IMemberRepository,
    payload: CreateMemberPayload
) {
    return repo.createMember(payload)
}
