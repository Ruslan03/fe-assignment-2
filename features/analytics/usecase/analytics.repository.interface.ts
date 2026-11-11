import type { MemberAnalyticsType } from "../domain/analytics.entity"

export interface IAnalyticsRepository {
  getMemberAnalytics: (memberId: string) => Promise<MemberAnalyticsType>
}

