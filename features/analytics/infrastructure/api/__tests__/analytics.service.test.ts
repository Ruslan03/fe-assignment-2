import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import type { MemberAnalyticsType } from "../../../domain/analytics.entity"
import { AnalyticsService } from "../analytics.service"

const MOCK_ANALYTICS: MemberAnalyticsType = {
  totalRepository: 42,
  totalDeployment: 1489,
}

describe("AnalyticsService", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_BASE_API_URL", "http://localhost:3000/api")
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it("fetches member analytics by id and throws when response is not ok", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ status: true, data: MOCK_ANALYTICS }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValue({
          status: false,
          message: "Member not found",
        }),
      })
    vi.stubGlobal("fetch", fetchMock)

    const service = new AnalyticsService()
    const result = await service.getMemberAnalytics("mem-001")

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/api/members/mem-001/analytics"
    )
    expect(result).toEqual(MOCK_ANALYTICS)

    await expect(service.getMemberAnalytics("missing")).rejects.toThrow(
      "Member not found"
    )
  })
})
