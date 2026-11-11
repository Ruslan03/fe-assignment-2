import { okResponse } from "../_mock/response"
import { getAnalytics } from "../_mock/store"

export const dynamic = "force-dynamic"

export async function GET(): Promise<Response> {
  const analytics = getAnalytics()
  return okResponse(analytics, "Success get analytics")
}

