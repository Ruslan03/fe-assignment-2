import { okResponse } from "../../_mock/response"
import { getMembersAnalytics } from "../../_mock/store"

export const dynamic = "force-dynamic"

export async function GET(): Promise<Response> {
  const analytics = getMembersAnalytics()
  return okResponse(analytics, "Success get members analytics")
}

