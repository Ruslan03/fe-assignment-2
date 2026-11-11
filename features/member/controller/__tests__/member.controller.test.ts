import { afterEach, describe, expect, it, vi } from "vitest"

import type {
  CreateMemberPayload,
  MemberType,
} from "../../domain/member.entity"
import { MemberService } from "../../infrastructure/api/member.service"
import { MemberCsvService } from "../../infrastructure/csv/member-csv.service"
import {
  createMemberController,
  deleteMemberController,
  exportMembersCsvController,
  getAllMemberController,
  getMemberByIdController,
  updateMemberController,
} from "../member.controller"

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

  it("creates member through MemberService and usecase", async () => {
    const spy = vi
      .spyOn(MemberService.prototype, "createMember")
      .mockResolvedValue(MOCK_MEMBERS)

    const members = await createMemberController(CREATE_PAYLOAD)
    expect(spy).toHaveBeenCalledWith(CREATE_PAYLOAD)
    expect(members).toEqual(MOCK_MEMBERS)
  })

  it("fetches single member by id through MemberService and usecase", async () => {
    const spy = vi
      .spyOn(MemberService.prototype, "getMemberById")
      .mockResolvedValue(MOCK_MEMBERS[0])

    const member = await getMemberByIdController("mem-001")
    expect(spy).toHaveBeenCalledWith("mem-001")
    expect(member).toEqual(MOCK_MEMBERS[0])
  })

  it("updates member through MemberService and usecase", async () => {
    const updatedMember = { ...MOCK_MEMBERS[0], role: "Staff Engineer" }
    const spy = vi
      .spyOn(MemberService.prototype, "updateMember")
      .mockResolvedValue(updatedMember)

    const member = await updateMemberController("mem-001", {
      role: "Staff Engineer",
    })
    expect(spy).toHaveBeenCalledWith("mem-001", { role: "Staff Engineer" })
    expect(member).toEqual(updatedMember)
  })

  it("deletes member through MemberService and usecase", async () => {
    const spy = vi
      .spyOn(MemberService.prototype, "deleteMember")
      .mockResolvedValue(MOCK_MEMBERS[0])

    const member = await deleteMemberController("mem-001")
    expect(spy).toHaveBeenCalledWith("mem-001")
    expect(member).toEqual(MOCK_MEMBERS[0])
  })

  it("exports all members through MemberService and MemberCsvService", async () => {
    const fetchSpy = vi
      .spyOn(MemberService.prototype, "getAllMembers")
      .mockResolvedValue(MOCK_MEMBERS)
    const exportSpy = vi
      .spyOn(MemberCsvService.prototype, "exportMembers")
      .mockImplementation(() => {})

    const members = await exportMembersCsvController()

    expect(fetchSpy).toHaveBeenCalledWith()
    expect(exportSpy).toHaveBeenCalledWith(MOCK_MEMBERS)
    expect(members).toEqual(MOCK_MEMBERS)
  })
})
