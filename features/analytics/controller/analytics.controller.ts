import { AnalyticsService } from "../infrastructure/api/analytics.service"
import { getMemberAnalyticsUseCase } from "../usecase/analytics.usecase"

export async function getMemberAnalyticsController(memberId: string) {
  const repo = new AnalyticsService()

  return getMemberAnalyticsUseCase(repo, memberId)
}

