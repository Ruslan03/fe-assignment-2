import type {
  BulkDeletePayload,
  CreateMemberPayload,
  MemberType,
  UpdateMemberPayload,
} from "../domain/member.entity"

export interface IMemberRepository {
  getAllMembers: (search?: string) => Promise<MemberType[]>
  getMemberById: (id: string) => Promise<MemberType>
  createMember: (payload: CreateMemberPayload) => Promise<MemberType[]>
  updateMember: (
    id: string,
    payload: UpdateMemberPayload
  ) => Promise<MemberType>
  deleteMember: (id: string) => Promise<MemberType>
  bulkDeleteMembers: (payload: BulkDeletePayload) => Promise<MemberType[]>
}
