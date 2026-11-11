import { beforeEach, describe, expect, it, vi } from "vitest"

import { store } from "@/shared/presentation/store"

import * as memberController from "../../../controller/member.controller"
import type {
  CreateMemberPayload,
  MemberType,
} from "../../../domain/member.entity"
import { createMember, fetchMembers } from "../member.action"
import {
  clearCreateError,
  initialMemberState,
  memberReducer,
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

  it("handles setSearch and clearCreateError reducers", () => {
    let state = memberReducer(initialMemberState, setSearch("alya"))
    expect(state.search).toBe("alya")

    state = memberReducer(
      { ...state, createError: "Submit failed" },
      clearCreateError()
    )
    expect(state.createError).toBeNull()
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

  it("selects member state with initial fallback when absent", () => {
    expect(
      selectMemberState({
        base: { version: "0.0.1" },
      })
    ).toEqual(initialMemberState)
  })
})
