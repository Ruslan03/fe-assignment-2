import { okResponse } from "../../_mock/response"
import { getDepartmentsAnalytics } from "../../_mock/store"

export const dynamic = "force-dynamic"

export async function GET(): Promise<Response> {
  const analytics = getDepartmentsAnalytics()
  return okResponse(analytics, "Success get departments analytics")
}

