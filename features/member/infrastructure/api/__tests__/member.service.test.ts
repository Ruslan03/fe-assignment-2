import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import type { CreateMemberPayload, MemberType } from "../../../domain/member.entity"
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

const CREATE_PAYLOAD: CreateMemberPayload = {
  name: "Hana Kusuma",
  email: "hana.kusuma@company.com",
  role: "DevOps Engineer",
  department: "Engineering",
  status: "active",
}

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

  it("posts payload to /members and throws when response is not ok", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ status: true, data: MOCK_MEMBERS }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValue({
          status: false,
          message: "Fields name, email, role, and department are required",
        }),
      })
    vi.stubGlobal("fetch", fetchMock)

    const service = new MemberService()
    const result = await service.createMember(CREATE_PAYLOAD)

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/api/members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(CREATE_PAYLOAD),
    })
    expect(result).toEqual(MOCK_MEMBERS)

    await expect(service.createMember(CREATE_PAYLOAD)).rejects.toThrow(
      "Fields name, email, role, and department are required"
    )
  })
})
