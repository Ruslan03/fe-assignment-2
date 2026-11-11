import { CreateMemberPayload } from "../domain/member.entity"
import { MemberService } from "../infrastructure/api/member.service"
import { createMemberUseCase, getAllMembersUseCase } from "../usecase/member.usecase"

export async function getAllMemberController(search?: string) {
    const repo = new MemberService()

    return getAllMembersUseCase(repo, search)
}

export async function createMemberController(payload: CreateMemberPayload) {
    const repo = new MemberService()

    return createMemberUseCase(repo, payload)
}
