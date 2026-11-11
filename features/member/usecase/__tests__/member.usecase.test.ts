import { describe, expect, it, vi } from "vitest"

import type { CreateMemberPayload, MemberType } from "../../domain/member.entity"
import type { IMemberRepository } from "../member.repository.interface"
import { createMemberUseCase, getAllMembersUseCase } from "../member.usecase"

const MOCK_MEMBERS: MemberType[] = [
  {
    id: "mem-001",
    name: "Ruslan Wanandi",
    email: "ruslan.wanandi@company.com",
    role: "Front-end Engineer",
    department: "Engineering",
    status: "active",
    joinDate: "2025-03-10T09:00:00.000Z",
  },
]

const CREATE_PAYLOAD: CreateMemberPayload = {
  name: "Hana Kusuma",
  email: "hana.kusuma@company.com",
  role: "DevOps Engineer",
  department: "Engineering",
  status: "active",
  joinDate: "2026-11-10T09:00:00.000Z",
}

describe("member usecases", () => {
  it("delegates getAllMembersUseCase to repository getAllMembers", async () => {
    const getAllMembers = vi.fn().mockResolvedValue(MOCK_MEMBERS)
    const createMember = vi.fn()
    const repo: IMemberRepository = { getAllMembers, createMember }

    const allResult = await getAllMembersUseCase(repo)
    expect(getAllMembers).toHaveBeenCalledWith(undefined)
    expect(allResult).toEqual(MOCK_MEMBERS)

    const searchResult = await getAllMembersUseCase(repo, "ruslan")
    expect(getAllMembers).toHaveBeenCalledWith("ruslan")
    expect(searchResult).toEqual(MOCK_MEMBERS)
  })

  it("delegates createMemberUseCase to repository createMember", async () => {
    const getAllMembers = vi.fn()
    const createMember = vi.fn().mockResolvedValue(MOCK_MEMBERS)
    const repo: IMemberRepository = { getAllMembers, createMember }

    const result = await createMemberUseCase(repo, CREATE_PAYLOAD)
    expect(createMember).toHaveBeenCalledWith(CREATE_PAYLOAD)
    expect(result).toEqual(MOCK_MEMBERS)
  })
})
