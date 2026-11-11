import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"

import { store } from "@/shared/presentation/store"
import { ReduxProvider } from "@/shared/presentation/store/provider"

import * as analyticsController from "../../../../controller/analytics.controller"
import type { AnalyticsItemType } from "../../../../domain/analytics.entity"
import { clearAnalyticsError, fetchAnalytics } from "../../../store"
import { MemberAnalyticsSummary } from "../member-analytics-summary"

const MOCK_ANALYTICS: AnalyticsItemType[] = [
  {
    key: "totalMembers",
    label: "Total Members",
    value: 148,
    trend: "+12 this month",
  },
  {
    key: "activeMembers",
    label: "Active Now",
    value: 132,
    trend: "94% live activity",
  },
  {
    key: "departments",
    label: "Departments",
    value: 8,
    trend: "8 active units",
  },
  {
    key: "pendingInvites",
    label: "Pending Invites",
    value: 5,
    trend: "3 expiring soon",
  },
]

describe("MemberAnalyticsSummary", () => {
  beforeEach(() => {
    store.dispatch(fetchAnalytics.fulfilled([], "", undefined))
    store.dispatch(clearAnalyticsError())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("loads analytics via Redux store, shows loading placeholders, and renders 4 StatCards", async () => {
    let resolvePending!: (items: AnalyticsItemType[]) => void
    const pendingPromise = new Promise<AnalyticsItemType[]>((resolve) => {
      resolvePending = resolve
    })

    const spy = vi
      .spyOn(analyticsController, "getAnalyticsController")
      .mockReturnValueOnce(pendingPromise)

    render(
      <ReduxProvider>
        <MemberAnalyticsSummary />
      </ReduxProvider>
    )

    expect(spy).toHaveBeenCalledTimes(1)
    expect(screen.getAllByText("--")).toHaveLength(4)

    await act(async () => {
      resolvePending(MOCK_ANALYTICS)
      await Promise.resolve()
    })

    expect(store.getState().analytics?.items).toEqual(MOCK_ANALYTICS)
    expect(screen.getByText("Total Members")).toBeInTheDocument()
    expect(screen.getByText("148")).toBeInTheDocument()
    expect(screen.getByText("+12 this month")).toBeInTheDocument()

    expect(screen.getByText("Active Now")).toBeInTheDocument()
    expect(screen.getByText("132")).toBeInTheDocument()
    expect(screen.getByText("94% live activity")).toBeInTheDocument()

    expect(screen.getByText("Departments")).toBeInTheDocument()
    expect(screen.getByText("8")).toBeInTheDocument()
    expect(screen.getByText("8 active units")).toBeInTheDocument()

    expect(screen.getByText("Pending Invites")).toBeInTheDocument()
    expect(screen.getByText("5")).toBeInTheDocument()
    expect(screen.getByText("3 expiring soon")).toBeInTheDocument()
  })

  it("renders error alert when analytics fetch fails", async () => {
    vi.spyOn(
      analyticsController,
      "getAnalyticsController"
    ).mockRejectedValueOnce(new Error("Failed to load analytics"))

    await act(async () => {
      render(
        <ReduxProvider>
          <MemberAnalyticsSummary />
        </ReduxProvider>
      )
      await Promise.resolve()
    })

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Failed to load analytics"
    )
  })
})

