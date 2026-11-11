import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"

vi.mock("@user/presentation/components/user-info", () => ({
  default: () => <div data-testid="mock-user-info">User Info</div>,
}))

import * as analyticsController from "@analytics/controller/analytics.controller"
import {
  clearAnalyticsError,
  fetchAnalytics,
} from "@analytics/presentation/store"
import * as memberController from "@member/controller/member.controller"
import { fetchMembers, setSearch } from "@member/presentation/store"
import { store } from "@/shared/presentation/store"
import { ReduxProvider } from "@/shared/presentation/store/provider"

import { DashboardMemberPage } from "../dashboard-member"

describe("DashboardMemberPage", () => {
  beforeEach(() => {
    store.dispatch(setSearch(""))
    store.dispatch(fetchMembers.fulfilled([], "", undefined))
    store.dispatch(fetchAnalytics.fulfilled([], "", undefined))
    store.dispatch(clearAnalyticsError())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("renders Members Directory header, MemberAnalyticsSummary, Add Member button, and MemberList", async () => {
    vi.spyOn(
      analyticsController,
      "getAnalyticsController"
    ).mockResolvedValueOnce([
      {
        key: "totalMembers",
        label: "Total Members",
        value: 8,
        trend: "+2 this month",
      },
      {
        key: "activeMembers",
        label: "Active Now",
        value: 6,
        trend: "75% live activity",
      },
      {
        key: "departments",
        label: "Departments",
        value: 5,
        trend: "5 active units",
      },
      {
        key: "pendingInvites",
        label: "Pending Invites",
        value: 3,
        trend: "2 expiring soon",
      },
    ])

    vi.spyOn(memberController, "getAllMemberController").mockResolvedValueOnce([
      {
        id: "mem-001",
        name: "Ruslan Wanandi",
        email: "ruslan.wanandi@company.com",
        role: "Front-end Engineer",
        department: "Engineering",
        status: "active",
        joinDate: "2025-03-10T09:00:00.000Z",
      },
    ])

    await act(async () => {
      render(
        <ReduxProvider>
          <DashboardMemberPage />
        </ReduxProvider>
      )
      await Promise.resolve()
    })

    expect(screen.getByTestId("mock-user-info")).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 1, name: "Members Directory" })
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Add Member" })).toHaveAttribute(
      "href",
      "/members/new"
    )
    expect(screen.getByText("Total Members")).toBeInTheDocument()
    expect(screen.getByText("+2 this month")).toBeInTheDocument()
    expect(screen.getByText("75% live activity")).toBeInTheDocument()
    expect(screen.getByText("Ruslan Wanandi")).toBeInTheDocument()
  })
})
