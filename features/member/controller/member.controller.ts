import type {
  CreateMemberPayload,
  UpdateMemberPayload,
} from "../domain/member.entity"
import { MemberService } from "../infrastructure/api/member.service"
import {
  createMemberUseCase,
  deleteMemberUseCase,
  getAllMembersUseCase,
  getMemberByIdUseCase,
  updateMemberUseCase,
} from "../usecase/member.usecase"

export async function getAllMemberController(search?: string) {
  const repo = new MemberService()

  return getAllMembersUseCase(repo, search)
}

export async function getMemberByIdController(id: string) {
  const repo = new MemberService()

  return getMemberByIdUseCase(repo, id)
}

export async function createMemberController(payload: CreateMemberPayload) {
  const repo = new MemberService()

  return createMemberUseCase(repo, payload)
}

export async function updateMemberController(
  id: string,
  payload: UpdateMemberPayload
) {
  const repo = new MemberService()

  return updateMemberUseCase(repo, id, payload)
}

export async function deleteMemberController(id: string) {
  const repo = new MemberService()

  return deleteMemberUseCase(repo, id)
}
