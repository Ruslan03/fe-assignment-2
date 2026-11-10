import { errorResponse, okResponse, parseJsonBody } from "../../_mock/response"
import { bulkDeleteMembers } from "../../_mock/store"
import type { BulkDeletePayload } from "../../_mock/types"

export const dynamic = "force-dynamic"

export async function POST(request: Request): Promise<Response> {
  const body = await parseJsonBody<Partial<BulkDeletePayload>>(request)
  if (!body || typeof body !== "object") {
    return errorResponse("Invalid JSON payload", 400)
  }

  if (
    !Array.isArray(body.ids) ||
    body.ids.length === 0 ||
    !body.ids.every((id) => typeof id === "string" && id.trim().length > 0)
  ) {
    return errorResponse("Field ids must be a non-empty array of strings", 400)
  }

  const { deletedCount, members } = bulkDeleteMembers(body.ids)

  return okResponse(
    members,
    `Success delete ${deletedCount} member(s)`
  )
}

