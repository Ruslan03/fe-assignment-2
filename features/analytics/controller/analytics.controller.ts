import { AnalyticsService } from "../infrastructure/api/analytics.service"
import {
  getAnalyticsUseCase,
  getMemberAnalyticsUseCase,
} from "../usecase/analytics.usecase"

export async function getAnalyticsController() {
  const repo = new AnalyticsService()

  return getAnalyticsUseCase(repo)
}

export async function getMemberAnalyticsController(memberId: string) {
  const repo = new AnalyticsService()

  return getMemberAnalyticsUseCase(repo, memberId)
}
