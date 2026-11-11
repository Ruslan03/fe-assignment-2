import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import type { MemberType } from "../../../domain/member.entity"
import { MemberService } from "../member.service"

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

describe("MemberService", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_BASE_API_URL", "http://localhost:3000/api")
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it("fetches all members without search query when search is omitted or blank", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ status: true, data: MOCK_MEMBERS }),
    })
    vi.stubGlobal("fetch", fetchMock)

    const service = new MemberService()

    const result = await service.getAllMembers()
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/api/members")
    expect(result).toEqual(MOCK_MEMBERS)

    await service.getAllMembers("   ")
    expect(fetchMock).toHaveBeenLastCalledWith(
      "http://localhost:3000/api/members"
    )
  })

  it("trims and URL-encodes the search query string", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ status: true, data: MOCK_MEMBERS }),
    })
    vi.stubGlobal("fetch", fetchMock)

    const service = new MemberService()
    const result = await service.getAllMembers("  UI/UX & Design  ")

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/api/members?search=UI%2FUX%20%26%20Design"
    )
    expect(result).toEqual(MOCK_MEMBERS)
  })
})

