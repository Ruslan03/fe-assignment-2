import { beforeEach, describe, expect, it, vi } from "vitest"

import { store } from "@/shared/presentation/store"

import * as memberController from "../../../controller/member.controller"
import type { MemberType } from "../../../domain/member.entity"
import { fetchMembers } from "../member.action"
import {
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

describe("memberSlice", () => {
  beforeEach(() => {
    store.dispatch(setSearch(""))
    store.dispatch(fetchMembers.fulfilled([], "", undefined))
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

  it("handles setSearch reducer", () => {
    const state = memberReducer(initialMemberState, setSearch("alya"))
    expect(state.search).toBe("alya")
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

    controllerSpy.mockResolvedValueOnce(
      null as unknown as MemberType[]
    )
    await store.dispatch(fetchMembers(undefined))
    expect(store.getState().member).toMatchObject({
      items: [],
      isLoading: false,
      error: null,
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
