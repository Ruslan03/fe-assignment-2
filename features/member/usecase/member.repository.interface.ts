import { CreateMemberPayload, MemberType } from "../domain/member.entity"

export interface IMemberRepository {
    getAllMembers: (search?: string) => Promise<MemberType[]>
    createMember: (payload: CreateMemberPayload) => Promise<MemberType[]>
}
