import { MemberService } from "../infrastructure/api/member.service";
import { getAllMembersUseCase } from "../usecase/member.usecase";

export async function getAllMemberController(search?: string) {
    const repo = new MemberService()

    return getAllMembersUseCase(repo, search)
}