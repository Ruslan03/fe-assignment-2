import type {
  AnalyticsItemType,
  MemberAnalyticsType,
} from "../../domain/analytics.entity"
import type { IAnalyticsRepository } from "../../usecase/analytics.repository.interface"

export class AnalyticsService implements IAnalyticsRepository {
  async getAnalytics(): Promise<AnalyticsItemType[]> {
    const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/analytics`
    const res = await fetch(url)
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data?.message ?? "Failed to fetch analytics")
    }

    return data?.data as AnalyticsItemType[]
  }

  async getMemberAnalytics(memberId: string): Promise<MemberAnalyticsType> {
    const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/members/${encodeURIComponent(memberId)}/analytics`
    const res = await fetch(url)
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data?.message ?? "Failed to fetch member analytics")
    }

    return data?.data as MemberAnalyticsType
  }
}
