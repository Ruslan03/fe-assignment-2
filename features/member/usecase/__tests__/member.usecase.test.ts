import { describe, expect, it, vi } from "vitest"

import type { MemberType } from "../../domain/member.entity"
import type { IMemberRepository } from "../member.repository.interface"
import { getAllMembersUseCase } from "../member.usecase"

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

describe("getAllMembersUseCase", () => {
  it("delegates to repository getAllMembers with optional search", async () => {
    const getAllMembers = vi.fn().mockResolvedValue(MOCK_MEMBERS)
    const repo: IMemberRepository = { getAllMembers }

    const allResult = await getAllMembersUseCase(repo)
    expect(getAllMembers).toHaveBeenCalledWith(undefined)
    expect(allResult).toEqual(MOCK_MEMBERS)

    const searchResult = await getAllMembersUseCase(repo, "ruslan")
    expect(getAllMembers).toHaveBeenCalledWith("ruslan")
    expect(searchResult).toEqual(MOCK_MEMBERS)
  })
})

