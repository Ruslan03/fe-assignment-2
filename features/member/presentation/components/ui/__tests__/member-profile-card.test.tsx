import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"

import * as analyticsController from "@analytics/controller/analytics.controller"
import { clearMemberAnalytics } from "@analytics/presentation/store"
import { store } from "@/shared/presentation/store"
import { ReduxProvider } from "@/shared/presentation/store/provider"

import type { MemberType } from "../../../../domain/member.entity"
import { MemberProfileCard } from "../member-profile-card"

const MOCK_MEMBER: MemberType = {
  id: "mem-2048",
  name: "Sarah Jenkins",
  email: "sarah.jenkins@acme.corp",
  role: "Staff Frontend Engineer",
  department: "Engineering",
  status: "active",
  joinDate: "2022-03-15T09:00:00.000Z",
}

describe("MemberProfileCard", () => {
  beforeEach(() => {
    store.dispatch(clearMemberAnalytics())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("renders avatar initials, identity metadata, and member analytics stats", async () => {
    const spy = vi
      .spyOn(analyticsController, "getMemberAnalyticsController")
      .mockResolvedValueOnce({
        totalRepository: 42,
        totalDeployment: 1489,
      })

    await act(async () => {
      render(
        <ReduxProvider>
          <MemberProfileCard member={MOCK_MEMBER} />
        </ReduxProvider>
      )
      await Promise.resolve()
    })

    expect(spy).toHaveBeenCalledWith("mem-2048")
    expect(screen.getByText("SJ")).toBeInTheDocument()
    expect(screen.getByText("Sarah Jenkins")).toBeInTheDocument()
    expect(screen.getByText("Staff Frontend Engineer")).toBeInTheDocument()
    expect(screen.getByText("sarah.jenkins@acme.corp")).toBeInTheDocument()
    expect(screen.getByText("42")).toBeInTheDocument()
    expect(screen.getByText("1,489")).toBeInTheDocument()
    expect(screen.getByText("REPOSITORIES")).toBeInTheDocument()
    expect(screen.getByText("DEPLOYMENTS")).toBeInTheDocument()
  })
})
