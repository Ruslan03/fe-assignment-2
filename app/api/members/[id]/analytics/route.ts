import { errorResponse, okResponse } from "../../../_mock/response"
import { getMemberAnalytics } from "../../../_mock/store"

export const dynamic = "force-dynamic"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(
  _request: Request,
  context: RouteContext
): Promise<Response> {
  const { id } = await context.params
  const analytics = getMemberAnalytics(id)

  if (!analytics) {
    return errorResponse("Member not found", 404)
  }

  return okResponse(analytics, "Success get member analytics")
}

