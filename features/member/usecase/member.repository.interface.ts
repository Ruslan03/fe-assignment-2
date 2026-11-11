import { MemberType } from "../domain/member.entity";

export interface IMemberRepository {
    getAllMembers: (search?: string) => Promise<MemberType[]>
}