import { beforeEach, describe, expect, it, vi } from "vitest"

import { store } from "@/shared/presentation/store"

import * as analyticsController from "../../../controller/analytics.controller"
import type {
  AnalyticsItemType,
  MemberAnalyticsType,
} from "../../../domain/analytics.entity"
import { fetchAnalytics, fetchMemberAnalytics } from "../analytics.action"
import {
  analyticsReducer,
  clearAnalyticsError,
  clearMemberAnalytics,
  initialAnalyticsState,
  selectAnalyticsState,
} from "../analytics.slice"

const SAMPLE_ITEMS: AnalyticsItemType[] = [
  {
    key: "totalMembers",
    label: "Total Members",
    value: 148,
    trend: "+12 this month",
  },
]

const SAMPLE_MEMBER_ANALYTICS: MemberAnalyticsType = {
  totalRepository: 42,
  totalDeployment: 1489,
}

describe("analyticsSlice", () => {
  beforeEach(() => {
    store.dispatch(fetchAnalytics.fulfilled([], "", undefined))
    store.dispatch(clearAnalyticsError())
    store.dispatch(clearMemberAnalytics())
    vi.restoreAllMocks()
  })

  it("registers analytics reducer alongside base reducer in the main store", () => {
    expect(Object.keys(store.reducerManager.getReducerMap())).toContain("base")
    expect(Object.keys(store.reducerManager.getReducerMap())).toContain(
      "analytics"
    )
    expect(store.getState().base).toEqual({ version: "0.0.1" })
    expect(store.getState().analytics).toMatchObject({
      items: [],
      isLoading: false,
      error: null,
      memberAnalytics: null,
      memberAnalyticsId: null,
      isMemberAnalyticsLoading: false,
      memberAnalyticsError: null,
    })
  })

  it("handles clearAnalyticsError and clearMemberAnalytics reducers", () => {
    let state = analyticsReducer(
      { ...initialAnalyticsState, error: "Load failed" },
      clearAnalyticsError()
    )
    expect(state.error).toBeNull()

    state = analyticsReducer(
      {
        ...state,
        memberAnalytics: SAMPLE_MEMBER_ANALYTICS,
        memberAnalyticsId: "mem-001",
        isMemberAnalyticsLoading: true,
        memberAnalyticsError: "Member error",
      },
      clearMemberAnalytics()
    )
    expect(state.memberAnalytics).toBeNull()
    expect(state.memberAnalyticsId).toBeNull()
    expect(state.isMemberAnalyticsLoading).toBe(false)
    expect(state.memberAnalyticsError).toBeNull()
  })

  it("fetches analytics summary via fetchAnalytics thunk and handles error state", async () => {
    const controllerSpy = vi
      .spyOn(analyticsController, "getAnalyticsController")
      .mockResolvedValueOnce(SAMPLE_ITEMS)

    await store.dispatch(fetchAnalytics())

    expect(controllerSpy).toHaveBeenCalledTimes(1)
    expect(store.getState().analytics).toMatchObject({
      items: SAMPLE_ITEMS,
      isLoading: false,
      hasLoaded: true,
      error: null,
    })

    controllerSpy.mockRejectedValueOnce(new Error("Network error"))
    await store.dispatch(fetchAnalytics())

    expect(store.getState().analytics).toMatchObject({
      isLoading: false,
      hasLoaded: true,
      error: "Network error",
    })

    controllerSpy.mockResolvedValueOnce(null as unknown as AnalyticsItemType[])
    await store.dispatch(fetchAnalytics())

    expect(store.getState().analytics).toMatchObject({
      items: [],
      isLoading: false,
      hasLoaded: true,
      error: null,
    })
  })

  it("fetches member analytics via fetchMemberAnalytics thunk and handles error state", async () => {
    const controllerSpy = vi
      .spyOn(analyticsController, "getMemberAnalyticsController")
      .mockResolvedValueOnce(SAMPLE_MEMBER_ANALYTICS)

    await store.dispatch(fetchMemberAnalytics("mem-001"))

    expect(controllerSpy).toHaveBeenCalledWith("mem-001")
    expect(store.getState().analytics).toMatchObject({
      memberAnalytics: SAMPLE_MEMBER_ANALYTICS,
      memberAnalyticsId: "mem-001",
      isMemberAnalyticsLoading: false,
      memberAnalyticsError: null,
    })

    controllerSpy.mockRejectedValueOnce(new Error("Member not found"))
    await store.dispatch(fetchMemberAnalytics("missing"))

    expect(store.getState().analytics).toMatchObject({
      memberAnalytics: null,
      memberAnalyticsId: "missing",
      isMemberAnalyticsLoading: false,
      memberAnalyticsError: "Member not found",
    })
  })

  it("selects analytics state with initial fallback when absent", () => {
    expect(
      selectAnalyticsState({
        base: { version: "0.0.1" },
      })
    ).toEqual(initialAnalyticsState)
  })
})
