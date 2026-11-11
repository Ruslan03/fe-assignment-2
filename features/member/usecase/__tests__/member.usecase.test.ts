import { describe, expect, it, vi } from "vitest"

import type {
  CreateMemberPayload,
  MemberType,
  UpdateMemberPayload,
} from "../../domain/member.entity"
import type { IMemberRepository } from "../member.repository.interface"
import {
  bulkDeleteMembersUseCase,
  createMemberUseCase,
  deleteMemberUseCase,
  exportMembersCsvUseCase,
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

function createMockRepository(
  overrides: Partial<IMemberRepository> = {}
): IMemberRepository {
  return {
    getAllMembers: vi.fn(),
    getMemberById: vi.fn(),
    createMember: vi.fn(),
    updateMember: vi.fn(),
    deleteMember: vi.fn(),
    bulkDeleteMembers: vi.fn(),
    ...overrides,
  }
}

describe("member usecases", () => {
  it("delegates getAllMembersUseCase to repository getAllMembers", async () => {
    const getAllMembers = vi.fn().mockResolvedValue(MOCK_MEMBERS)
    const repo = createMockRepository({ getAllMembers })

    const allResult = await getAllMembersUseCase(repo)
    expect(getAllMembers).toHaveBeenCalledWith(undefined)
    expect(allResult).toEqual(MOCK_MEMBERS)

    const searchResult = await getAllMembersUseCase(repo, "ruslan")
    expect(getAllMembers).toHaveBeenCalledWith("ruslan")
    expect(searchResult).toEqual(MOCK_MEMBERS)
  })

  it("delegates getMemberByIdUseCase to repository getMemberById", async () => {
    const getMemberById = vi.fn().mockResolvedValue(MOCK_MEMBERS[0])
    const repo = createMockRepository({ getMemberById })

    const result = await getMemberByIdUseCase(repo, "mem-001")
    expect(getMemberById).toHaveBeenCalledWith("mem-001")
    expect(result).toEqual(MOCK_MEMBERS[0])
  })

  it("delegates createMemberUseCase to repository createMember", async () => {
    const createMember = vi.fn().mockResolvedValue(MOCK_MEMBERS)
    const repo = createMockRepository({ createMember })

    const result = await createMemberUseCase(repo, CREATE_PAYLOAD)
    expect(createMember).toHaveBeenCalledWith(CREATE_PAYLOAD)
    expect(result).toEqual(MOCK_MEMBERS)
  })

  it("delegates updateMemberUseCase to repository updateMember", async () => {
    const updatedMember = { ...MOCK_MEMBERS[0], ...UPDATE_PAYLOAD }
    const updateMember = vi.fn().mockResolvedValue(updatedMember)
    const repo = createMockRepository({ updateMember })

    const result = await updateMemberUseCase(repo, "mem-001", UPDATE_PAYLOAD)
    expect(updateMember).toHaveBeenCalledWith("mem-001", UPDATE_PAYLOAD)
    expect(result).toEqual(updatedMember)
  })

  it("delegates deleteMemberUseCase to repository deleteMember", async () => {
    const deleteMember = vi.fn().mockResolvedValue(MOCK_MEMBERS[0])
    const repo = createMockRepository({ deleteMember })

    const result = await deleteMemberUseCase(repo, "mem-001")
    expect(deleteMember).toHaveBeenCalledWith("mem-001")
    expect(result).toEqual(MOCK_MEMBERS[0])
  })

  it("delegates bulkDeleteMembersUseCase to repository bulkDeleteMembers", async () => {
    const bulkDeleteMembers = vi.fn().mockResolvedValue([])
    const repo = createMockRepository({ bulkDeleteMembers })

    const result = await bulkDeleteMembersUseCase(repo, { ids: ["mem-001"] })
    expect(bulkDeleteMembers).toHaveBeenCalledWith({ ids: ["mem-001"] })
    expect(result).toEqual([])
  })

  it("fetches all members without search query and delegates exportMembersCsvUseCase to csvExporter", async () => {
    const getAllMembers = vi.fn().mockResolvedValue(MOCK_MEMBERS)
    const exportMembers = vi.fn()
    const repo = createMockRepository({ getAllMembers })

    const result = await exportMembersCsvUseCase(repo, { exportMembers })

    expect(getAllMembers).toHaveBeenCalledWith()
    expect(exportMembers).toHaveBeenCalledWith(MOCK_MEMBERS)
    expect(result).toEqual(MOCK_MEMBERS)
  })
})
