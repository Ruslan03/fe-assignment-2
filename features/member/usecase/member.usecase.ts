import type {
  CreateMemberPayload,
  UpdateMemberPayload,
} from "../domain/member.entity"
import type { IMemberRepository } from "./member.repository.interface"

export async function getAllMembersUseCase(
  repo: IMemberRepository,
  search?: string
) {
  return repo.getAllMembers(search)
}

export async function getMemberByIdUseCase(
  repo: IMemberRepository,
  id: string
) {
  return repo.getMemberById(id)
}

export async function createMemberUseCase(
  repo: IMemberRepository,
  payload: CreateMemberPayload
) {
  return repo.createMember(payload)
}

export async function updateMemberUseCase(
  repo: IMemberRepository,
  id: string,
  payload: UpdateMemberPayload
) {
  return repo.updateMember(id, payload)
}

export async function deleteMemberUseCase(repo: IMemberRepository, id: string) {
  return repo.deleteMember(id)
}
