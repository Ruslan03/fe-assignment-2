import { describe, expect, it, vi } from "vitest"

import type {
  AnalyticsItemType,
  MemberAnalyticsType,
} from "../../domain/analytics.entity"
import type { IAnalyticsRepository } from "../analytics.repository.interface"
import {
  getAnalyticsUseCase,
  getMemberAnalyticsUseCase,
} from "../analytics.usecase"

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

describe("analytics usecases", () => {
  it("delegates getAnalyticsUseCase to repository getAnalytics", async () => {
    const getAnalytics = vi.fn().mockResolvedValue(MOCK_ITEMS)
    const repo: IAnalyticsRepository = {
      getAnalytics,
      getMemberAnalytics: vi.fn(),
    }

    const result = await getAnalyticsUseCase(repo)

    expect(getAnalytics).toHaveBeenCalledTimes(1)
    expect(result).toEqual(MOCK_ITEMS)
  })

  it("delegates getMemberAnalyticsUseCase to repository getMemberAnalytics", async () => {
    const getMemberAnalytics = vi.fn().mockResolvedValue(MOCK_ANALYTICS)
    const repo: IAnalyticsRepository = {
      getAnalytics: vi.fn(),
      getMemberAnalytics,
    }

    const result = await getMemberAnalyticsUseCase(repo, "mem-001")

    expect(getMemberAnalytics).toHaveBeenCalledWith("mem-001")
    expect(result).toEqual(MOCK_ANALYTICS)
  })
})
