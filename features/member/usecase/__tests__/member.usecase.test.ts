import { describe, expect, it, vi } from "vitest"

import type {
  CreateMemberPayload,
  MemberType,
  UpdateMemberPayload,
} from "../../domain/member.entity"
import type { IMemberRepository } from "../member.repository.interface"
import {
  createMemberUseCase,
  getAllMembersUseCase,
  getMemberByIdUseCase,
  updateMemberUseCase,
} from "../member.usecase"

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

const UPDATE_PAYLOAD: UpdateMemberPayload = {
  role: "Senior Front-end Engineer",
  status: "inactive",
}

describe("member usecases", () => {
  it("delegates getAllMembersUseCase to repository getAllMembers", async () => {
    const getAllMembers = vi.fn().mockResolvedValue(MOCK_MEMBERS)
    const repo: IMemberRepository = {
      getAllMembers,
      getMemberById: vi.fn(),
      createMember: vi.fn(),
      updateMember: vi.fn(),
    }

    const allResult = await getAllMembersUseCase(repo)
    expect(getAllMembers).toHaveBeenCalledWith(undefined)
    expect(allResult).toEqual(MOCK_MEMBERS)

    const searchResult = await getAllMembersUseCase(repo, "ruslan")
    expect(getAllMembers).toHaveBeenCalledWith("ruslan")
    expect(searchResult).toEqual(MOCK_MEMBERS)
  })

  it("delegates getMemberByIdUseCase to repository getMemberById", async () => {
    const getMemberById = vi.fn().mockResolvedValue(MOCK_MEMBERS[0])
    const repo: IMemberRepository = {
      getAllMembers: vi.fn(),
      getMemberById,
      createMember: vi.fn(),
      updateMember: vi.fn(),
    }

    const result = await getMemberByIdUseCase(repo, "mem-001")
    expect(getMemberById).toHaveBeenCalledWith("mem-001")
    expect(result).toEqual(MOCK_MEMBERS[0])
  })

  it("delegates createMemberUseCase to repository createMember", async () => {
    const createMember = vi.fn().mockResolvedValue(MOCK_MEMBERS)
    const repo: IMemberRepository = {
      getAllMembers: vi.fn(),
      getMemberById: vi.fn(),
      createMember,
      updateMember: vi.fn(),
    }

    const result = await createMemberUseCase(repo, CREATE_PAYLOAD)
    expect(createMember).toHaveBeenCalledWith(CREATE_PAYLOAD)
    expect(result).toEqual(MOCK_MEMBERS)
  })

  it("delegates updateMemberUseCase to repository updateMember", async () => {
    const updatedMember = { ...MOCK_MEMBERS[0], ...UPDATE_PAYLOAD }
    const updateMember = vi.fn().mockResolvedValue(updatedMember)
    const repo: IMemberRepository = {
      getAllMembers: vi.fn(),
      getMemberById: vi.fn(),
      createMember: vi.fn(),
      updateMember,
    }

    const result = await updateMemberUseCase(repo, "mem-001", UPDATE_PAYLOAD)
    expect(updateMember).toHaveBeenCalledWith("mem-001", UPDATE_PAYLOAD)
    expect(result).toEqual(updatedMember)
  })
})
