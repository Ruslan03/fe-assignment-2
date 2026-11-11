import type { IAnalyticsRepository } from "./analytics.repository.interface"

export async function getAnalyticsUseCase(repo: IAnalyticsRepository) {
  return repo.getAnalytics()
}

export async function getMemberAnalyticsUseCase(
  repo: IAnalyticsRepository,
  memberId: string
) {
  return repo.getMemberAnalytics(memberId)
}
