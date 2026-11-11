import { afterEach, describe, expect, it, vi } from "vitest"

import type { MemberType } from "../../../domain/member.entity"
import { MemberCsvService } from "../member-csv.service"

const MOCK_MEMBERS: MemberType[] = [
  {
    id: "mem-001",
    name: "Ruslan Wanandi",
    email: "ruslan.wanandi@company.com",
    role: "Front-end Engineer",
    department: "Engineering",
    employmentType: "Full-Time",
    bio: "Frontend architecture lead",
    status: "active",
    joinDate: "2025-03-10T09:00:00.000Z",
  },
]

describe("MemberCsvService", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("generates CSV via react-csv and triggers automatic download via object URL", async () => {
    let capturedBlob: Blob | null = null
    const createObjectURL = vi.fn((blob: Blob) => {
      capturedBlob = blob
      return "blob:http://localhost/members-export"
    })
    const revokeObjectURL = vi.fn()

    vi.stubGlobal("URL", {
      ...URL,
      createObjectURL,
      revokeObjectURL,
    })

    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {})

    const appendSpy = vi.spyOn(document.body, "appendChild")
    const removeSpy = vi.spyOn(document.body, "removeChild")

    const service = new MemberCsvService()
    service.exportMembers(MOCK_MEMBERS)

    expect(createObjectURL).toHaveBeenCalledTimes(1)
    expect(capturedBlob).toBeInstanceOf(Blob)

    const csvText = await capturedBlob!.text()
    expect(csvText).toContain(
      '"ID","Name","Email","Role","Department","Employment Type","Bio","Status","Join Date"'
    )
    expect(csvText).toContain(
      '"mem-001","Ruslan Wanandi","ruslan.wanandi@company.com","Front-end Engineer","Engineering","Full-Time","Frontend architecture lead","active","2025-03-10T09:00:00.000Z"'
    )

    expect(appendSpy).toHaveBeenCalledTimes(1)
    const anchor = appendSpy.mock.calls[0][0] as HTMLAnchorElement
    expect(anchor.getAttribute("href")).toBe(
      "blob:http://localhost/members-export"
    )
    expect(anchor.getAttribute("download")).toBe("members.csv")
    expect(clickSpy).toHaveBeenCalledTimes(1)
    expect(removeSpy).toHaveBeenCalledWith(anchor)
    expect(revokeObjectURL).toHaveBeenCalledWith(
      "blob:http://localhost/members-export"
    )
  })

  it("falls back to data URI when URL.createObjectURL is unavailable", () => {
    vi.stubGlobal("URL", {})
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {})
    const appendSpy = vi.spyOn(document.body, "appendChild")

    const service = new MemberCsvService()
    service.exportMembers(MOCK_MEMBERS, "custom.csv")

    const anchor = appendSpy.mock.calls[0][0] as HTMLAnchorElement
    expect(anchor.getAttribute("href")).toMatch(
      /^data:text\/csv;charset=utf-8,/
    )
    expect(anchor.getAttribute("download")).toBe("custom.csv")
    expect(clickSpy).toHaveBeenCalledTimes(1)
  })
})
