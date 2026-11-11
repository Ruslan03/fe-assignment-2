import { afterEach, describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"

import * as analyticsController from "../../../../controller/analytics.controller"
import type { MemberAnalyticsType } from "../../../../domain/analytics.entity"
import { MemberAnalyticsStats } from "../member-analytics-stats"

describe("MemberAnalyticsStats", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("fetches member analytics and formats repository and deployment counts", async () => {
    let resolvePending!: (value: MemberAnalyticsType) => void
    const pendingPromise = new Promise<MemberAnalyticsType>((resolve) => {
      resolvePending = resolve
    })

    const spy = vi
      .spyOn(analyticsController, "getMemberAnalyticsController")
      .mockReturnValueOnce(pendingPromise)

    render(<MemberAnalyticsStats memberId="mem-001" />)

    expect(spy).toHaveBeenCalledWith("mem-001")
    expect(screen.getAllByText("--")).toHaveLength(2)
    expect(screen.getByText("REPOSITORIES")).toBeInTheDocument()
    expect(screen.getByText("DEPLOYMENTS")).toBeInTheDocument()

    await act(async () => {
      resolvePending({ totalRepository: 42, totalDeployment: 1489 })
      await Promise.resolve()
    })

    expect(screen.getByText("42")).toBeInTheDocument()
    expect(screen.getByText("1,489")).toBeInTheDocument()
  })

  it("falls back to zero counts when fetching fails", async () => {
    vi.spyOn(
      analyticsController,
      "getMemberAnalyticsController"
    ).mockRejectedValueOnce(new Error("Failed"))

    await act(async () => {
      render(<MemberAnalyticsStats memberId="mem-001" />)
      await Promise.resolve()
    })

    expect(screen.getAllByText("0")).toHaveLength(2)
  })
})

