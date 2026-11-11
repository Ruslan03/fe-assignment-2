import { beforeEach, describe, expect, it, vi } from "vitest"

import { store } from "@/shared/presentation/store"

import * as memberController from "../../../controller/member.controller"
import type {
  CreateMemberPayload,
  MemberType,
} from "../../../domain/member.entity"
import {
  bulkDeleteMembers,
  createMember,
  deleteMember,
  exportMembersCsv,
  fetchMemberById,
  fetchMembers,
  updateMember,
} from "../member.action"
import {
  clearBulkDeleteError,
  clearCreateError,
  clearDeleteError,
  clearExportError,
  clearSelectedMember,
  clearUpdateError,
  initialMemberState,
  memberReducer,
  removeMemberFromState,
  selectMemberState,
  setSearch,
} from "../member.slice"

const SAMPLE_MEMBERS: MemberType[] = [
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
  name: "Michael Phelps",
  email: "michael.phelps@acme.corp",
  role: "Staff UI/UX Designer",
  department: "Design",
  status: "active",
}

describe("memberSlice", () => {
  beforeEach(() => {
    store.dispatch(setSearch(""))
    store.dispatch(fetchMembers.fulfilled([], "", undefined))
    store.dispatch(clearCreateError())
    store.dispatch(clearUpdateError())
    store.dispatch(clearDeleteError())
    store.dispatch(clearBulkDeleteError())
    store.dispatch(clearExportError())
    store.dispatch(clearSelectedMember())
    vi.restoreAllMocks()
  })

  it("registers member reducer alongside base reducer in the main store", () => {
    expect(Object.keys(store.reducerManager.getReducerMap())).toContain("base")
    expect(Object.keys(store.reducerManager.getReducerMap())).toContain(
      "member"
    )
    expect(store.getState().base).toEqual({ version: "0.0.1" })
    expect(store.getState().member).toEqual(initialMemberState)
  })

  it("handles setSearch, error clearing, clearSelectedMember, and removeMemberFromState reducers", () => {
    let state = memberReducer(initialMemberState, setSearch("alya"))
    expect(state.search).toBe("alya")

    state = memberReducer(
      {
        ...state,
        createError: "Submit failed",
        updateError: "Update failed",
        deleteError: "Delete failed",
        bulkDeleteError: "Bulk delete failed",
        exportError: "Export failed",
      },
      clearCreateError()
    )
    expect(state.createError).toBeNull()

    state = memberReducer(state, clearUpdateError())
    expect(state.updateError).toBeNull()

    state = memberReducer(state, clearDeleteError())
    expect(state.deleteError).toBeNull()

    state = memberReducer(state, clearBulkDeleteError())
    expect(state.bulkDeleteError).toBeNull()

    state = memberReducer(state, clearExportError())
    expect(state.exportError).toBeNull()

    state = memberReducer(
      {
        ...state,
        items: SAMPLE_MEMBERS,
        selectedMember: SAMPLE_MEMBERS[0],
      },
      removeMemberFromState("mem-001")
    )
    expect(state.items).toEqual([])
    expect(state.selectedMember).toBeNull()

    state = memberReducer(
      {
        ...state,
        selectedMember: SAMPLE_MEMBERS[0],
        isDetailLoading: true,
        detailError: "Load failed",
      },
      clearSelectedMember()
    )
    expect(state.selectedMember).toBeNull()
    expect(state.isDetailLoading).toBe(false)
    expect(state.detailError).toBeNull()
  })

  it("fetches members via fetchMembers thunk and handles error state", async () => {
    const controllerSpy = vi
      .spyOn(memberController, "getAllMemberController")
      .mockResolvedValueOnce(SAMPLE_MEMBERS)

    await store.dispatch(fetchMembers("ruslan"))

    expect(controllerSpy).toHaveBeenCalledWith("ruslan")
    expect(store.getState().member).toMatchObject({
      items: SAMPLE_MEMBERS,
      isLoading: false,
      error: null,
    })

    controllerSpy.mockRejectedValueOnce(new Error("Network error"))
    await store.dispatch(fetchMembers(undefined))

    expect(store.getState().member).toMatchObject({
      isLoading: false,
      error: "Network error",
    })

    controllerSpy.mockResolvedValueOnce(null as unknown as MemberType[])
    await store.dispatch(fetchMembers(undefined))
    expect(store.getState().member).toMatchObject({
      items: [],
      isLoading: false,
      error: null,
    })
  })

  it("creates member via createMember thunk and handles error state", async () => {
    const controllerSpy = vi
      .spyOn(memberController, "createMemberController")
      .mockResolvedValueOnce(SAMPLE_MEMBERS)

    await store.dispatch(createMember(CREATE_PAYLOAD))

    expect(controllerSpy).toHaveBeenCalledWith(CREATE_PAYLOAD)
    expect(store.getState().member).toMatchObject({
      items: SAMPLE_MEMBERS,
      isCreating: false,
      createError: null,
    })

    controllerSpy.mockRejectedValueOnce(new Error("Validation failed"))
    await store.dispatch(createMember(CREATE_PAYLOAD))

    expect(store.getState().member).toMatchObject({
      isCreating: false,
      createError: "Validation failed",
    })
  })

  it("fetches member detail via fetchMemberById thunk and handles error state", async () => {
    const controllerSpy = vi
      .spyOn(memberController, "getMemberByIdController")
      .mockResolvedValueOnce(SAMPLE_MEMBERS[0])

    await store.dispatch(fetchMemberById("mem-001"))

    expect(controllerSpy).toHaveBeenCalledWith("mem-001")
    expect(store.getState().member).toMatchObject({
      selectedMember: SAMPLE_MEMBERS[0],
      isDetailLoading: false,
      detailError: null,
    })

    controllerSpy.mockRejectedValueOnce(new Error("Member not found"))
    await store.dispatch(fetchMemberById("missing"))

    expect(store.getState().member).toMatchObject({
      selectedMember: null,
      isDetailLoading: false,
      detailError: "Member not found",
    })
  })

  it("updates member via updateMember thunk, syncs items and selectedMember, and handles error", async () => {
    const updatedMember: MemberType = {
      ...SAMPLE_MEMBERS[0],
      role: "Staff Front-end Engineer",
    }
    store.dispatch(fetchMembers.fulfilled(SAMPLE_MEMBERS, "", undefined))

    const controllerSpy = vi
      .spyOn(memberController, "updateMemberController")
      .mockResolvedValueOnce(updatedMember)

    await store.dispatch(
      updateMember({
        id: "mem-001",
        payload: { role: "Staff Front-end Engineer" },
      })
    )

    expect(controllerSpy).toHaveBeenCalledWith("mem-001", {
      role: "Staff Front-end Engineer",
    })
    expect(store.getState().member).toMatchObject({
      selectedMember: updatedMember,
      items: [updatedMember],
      isUpdating: false,
      updateError: null,
    })

    controllerSpy.mockRejectedValueOnce(new Error("Update failed"))
    await store.dispatch(
      updateMember({
        id: "mem-001",
        payload: { role: "Staff Front-end Engineer" },
      })
    )

    expect(store.getState().member).toMatchObject({
      isUpdating: false,
      updateError: "Update failed",
    })
  })

  it("deletes member via deleteMember thunk and tracks loading and error states", async () => {
    const controllerSpy = vi
      .spyOn(memberController, "deleteMemberController")
      .mockResolvedValueOnce(SAMPLE_MEMBERS[0])

    await store.dispatch(deleteMember("mem-001"))

    expect(controllerSpy).toHaveBeenCalledWith("mem-001")
    expect(store.getState().member).toMatchObject({
      isDeleting: false,
      deletingMemberId: null,
      deleteError: null,
    })

    controllerSpy.mockRejectedValueOnce(new Error("Delete failed"))
    await store.dispatch(deleteMember("mem-001"))

    expect(store.getState().member).toMatchObject({
      isDeleting: false,
      deletingMemberId: null,
      deleteError: "Delete failed",
    })
  })

  it("exports CSV via exportMembersCsv thunk without altering list items or search query", async () => {
    store.dispatch(setSearch("filtered"))
    store.dispatch(fetchMembers.fulfilled([], "", "filtered"))

    const controllerSpy = vi
      .spyOn(memberController, "exportMembersCsvController")
      .mockResolvedValueOnce(SAMPLE_MEMBERS)

    await store.dispatch(exportMembersCsv())

    expect(controllerSpy).toHaveBeenCalledTimes(1)
    expect(store.getState().member).toMatchObject({
      items: [],
      search: "filtered",
      isExporting: false,
      exportError: null,
    })

    controllerSpy.mockRejectedValueOnce(new Error("Export failed"))
    await store.dispatch(exportMembersCsv())

    expect(store.getState().member).toMatchObject({
      isExporting: false,
      exportError: "Export failed",
    })
  })

  it("bulk deletes members via bulkDeleteMembers thunk while respecting active search filter", async () => {
    const secondMember: MemberType = {
      ...SAMPLE_MEMBERS[0],
      id: "mem-002",
      name: "Dimas Nugroho",
      email: "dimas.nugroho@company.com",
    }
    const thirdMember: MemberType = {
      ...SAMPLE_MEMBERS[0],
      id: "mem-003",
      name: "Siti Rahma",
      email: "siti.rahma@company.com",
    }

    store.dispatch(fetchMembers.fulfilled(SAMPLE_MEMBERS, "", undefined))
    store.dispatch(fetchMemberById.fulfilled(SAMPLE_MEMBERS[0], "", "mem-001"))

    let resolveBulkDelete!: (members: MemberType[]) => void
    const pendingPromise = new Promise<MemberType[]>((resolve) => {
      resolveBulkDelete = resolve
    })
    const controllerSpy = vi
      .spyOn(memberController, "bulkDeleteMembersController")
      .mockReturnValueOnce(pendingPromise)

    const dispatchPromise = store.dispatch(
      bulkDeleteMembers({ ids: ["mem-001"] })
    )
    expect(store.getState().member?.isBulkDeleting).toBe(true)

    resolveBulkDelete([secondMember, thirdMember])
    await dispatchPromise

    expect(controllerSpy).toHaveBeenCalledWith({ ids: ["mem-001"] })
    expect(store.getState().member).toMatchObject({
      isBulkDeleting: false,
      bulkDeleteError: null,
      items: [secondMember, thirdMember],
      selectedMember: null,
    })

    store.dispatch(setSearch("dimas"))
    store.dispatch(fetchMembers.fulfilled([secondMember], "", "dimas"))
    controllerSpy.mockResolvedValueOnce([thirdMember])

    await store.dispatch(bulkDeleteMembers({ ids: ["mem-002"] }))
    expect(store.getState().member?.items).toEqual([])

    controllerSpy.mockRejectedValueOnce(new Error("Bulk delete failed"))
    await store.dispatch(bulkDeleteMembers({ ids: ["mem-003"] }))

    expect(store.getState().member).toMatchObject({
      isBulkDeleting: false,
      bulkDeleteError: "Bulk delete failed",
    })
  })

  it("selects member state with initial fallback when absent", () => {
    expect(
      selectMemberState({
        base: { version: "0.0.1" },
      })
    ).toEqual(initialMemberState)
  })
})
