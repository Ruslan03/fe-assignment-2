import { afterEach, describe, expect, it, vi } from "vitest"

import type { MemberType } from "../../domain/member.entity"
import { MemberService } from "../../infrastructure/api/member.service"
import { getAllMemberController } from "../member.controller"

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

describe("member.controller", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("fetches members through MemberService and usecase", async () => {
    const spy = vi
      .spyOn(MemberService.prototype, "getAllMembers")
      .mockResolvedValue(MOCK_MEMBERS)

    const allMembers = await getAllMemberController()
    expect(spy).toHaveBeenCalledWith(undefined)
    expect(allMembers).toEqual(MOCK_MEMBERS)

    const filteredMembers = await getAllMemberController("engineering")
    expect(spy).toHaveBeenCalledWith("engineering")
    expect(filteredMembers).toEqual(MOCK_MEMBERS)
  })
})

