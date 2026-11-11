import { describe, expect, it, vi } from "vitest"

import type { MemberAnalyticsType } from "../../domain/analytics.entity"
import type { IAnalyticsRepository } from "../analytics.repository.interface"
import { getMemberAnalyticsUseCase } from "../analytics.usecase"

const MOCK_ANALYTICS: MemberAnalyticsType = {
  totalRepository: 42,
  totalDeployment: 1489,
}

describe("analytics usecases", () => {
  it("delegates getMemberAnalyticsUseCase to repository getMemberAnalytics", async () => {
    const getMemberAnalytics = vi.fn().mockResolvedValue(MOCK_ANALYTICS)
    const repo: IAnalyticsRepository = { getMemberAnalytics }

    const result = await getMemberAnalyticsUseCase(repo, "mem-001")

    expect(getMemberAnalytics).toHaveBeenCalledWith("mem-001")
    expect(result).toEqual(MOCK_ANALYTICS)
  })
})

