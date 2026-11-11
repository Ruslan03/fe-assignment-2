import { afterEach, describe, expect, it, vi } from "vitest"

import type {
  AnalyticsItemType,
  MemberAnalyticsType,
} from "../../domain/analytics.entity"
import { AnalyticsService } from "../../infrastructure/api/analytics.service"
import {
  getAnalyticsController,
  getMemberAnalyticsController,
} from "../analytics.controller"

const MOCK_ITEMS: AnalyticsItemType[] = [
  {
    key: "totalMembers",
    label: "Total Members",
    value: 148,
    trend: "+12 this month",
  },
]

const MOCK_ANALYTICS: MemberAnalyticsType = {
  totalRepository: 42,
  totalDeployment: 1489,
}

describe("analytics.controller", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("fetches analytics summary through AnalyticsService and usecase", async () => {
    const spy = vi
      .spyOn(AnalyticsService.prototype, "getAnalytics")
      .mockResolvedValue(MOCK_ITEMS)

    const result = await getAnalyticsController()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(result).toEqual(MOCK_ITEMS)
  })

  it("fetches member analytics through AnalyticsService and usecase", async () => {
    const spy = vi
      .spyOn(AnalyticsService.prototype, "getMemberAnalytics")
      .mockResolvedValue(MOCK_ANALYTICS)

    const result = await getMemberAnalyticsController("mem-001")

    expect(spy).toHaveBeenCalledWith("mem-001")
    expect(result).toEqual(MOCK_ANALYTICS)
  })
})
