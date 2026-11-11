import type {
  AnalyticsItemType,
  MemberAnalyticsType,
} from "../domain/analytics.entity"

export interface IAnalyticsRepository {
  getAnalytics: () => Promise<AnalyticsItemType[]>
  getMemberAnalytics: (memberId: string) => Promise<MemberAnalyticsType>
}
