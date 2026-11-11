import { errorResponse, okResponse, parseJsonBody } from "../../_mock/response"
import {
  deleteMember,
  getMemberById,
  isValidMemberStatus,
  updateMember,
} from "../../_mock/store"
import type { UpdateMemberPayload } from "../../_mock/types"

export const dynamic = "force-dynamic"

interface RouteContext {
  params: Promise<{ id: string }>
}

function isInvalidOptionalString(value: unknown): boolean {
  return (
    value !== undefined && (typeof value !== "string" || value.trim() === "")
  )
}

export async function GET(
  _request: Request,
  context: RouteContext
): Promise<Response> {
  const { id } = await context.params
  const member = getMemberById(id)

  if (!member) {
    return errorResponse("Member not found", 404)
  }

  return okResponse(member, "Success get member")
}

export async function PUT(
  request: Request,
  context: RouteContext
): Promise<Response> {
  const { id } = await context.params
  const body = await parseJsonBody<UpdateMemberPayload>(request)

  if (!body || typeof body !== "object") {
    return errorResponse("Invalid JSON payload", 400)
  }

  if (
    isInvalidOptionalString(body.name) ||
    isInvalidOptionalString(body.email) ||
    isInvalidOptionalString(body.role) ||
    isInvalidOptionalString(body.department)
  ) {
    return errorResponse(
      "Fields name, email, role, and department cannot be empty",
      400
    )
  }

  if (
    (body.employmentType !== undefined &&
      typeof body.employmentType !== "string") ||
    (body.bio !== undefined && typeof body.bio !== "string")
  ) {
    return errorResponse("Fields employmentType and bio must be strings", 400)
  }

  if (body.status !== undefined && !isValidMemberStatus(body.status)) {
    return errorResponse('Field status must be "active" or "inactive"', 400)
  }

  if (body.joinDate !== undefined && body.joinDate !== "") {
    if (
      typeof body.joinDate !== "string" ||
      Number.isNaN(new Date(body.joinDate).getTime())
    ) {
      return errorResponse(
        "Field joinDate must be a valid datetime string",
        400
      )
    }
  }

  const updated = updateMember(id, body)
  if (!updated) {
    return errorResponse("Member not found", 404)
  }

  return okResponse(updated, "Success update member")
}

export async function DELETE(
  _request: Request,
  context: RouteContext
): Promise<Response> {
  const { id } = await context.params
  const deleted = deleteMember(id)

  if (!deleted) {
    return errorResponse("Member not found", 404)
  }

  return okResponse(deleted, "Success delete member")
}
