import { errorResponse, okResponse, parseJsonBody } from "../_mock/response"
import { createMember, getMembers, isValidMemberStatus } from "../_mock/store"
import type { CreateMemberPayload } from "../_mock/types"

export const dynamic = "force-dynamic"

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const members = getMembers({
    search: searchParams.get("search") ?? undefined,
    department: searchParams.get("department") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    role: searchParams.get("role") ?? undefined,
  })

  return okResponse(members, "Success get members")
}

export async function POST(request: Request): Promise<Response> {
  const body = await parseJsonBody<Partial<CreateMemberPayload>>(request)
  if (!body || typeof body !== "object") {
    return errorResponse("Invalid JSON payload", 400)
  }

  if (
    !isNonEmptyString(body.name) ||
    !isNonEmptyString(body.email) ||
    !isNonEmptyString(body.role) ||
    !isNonEmptyString(body.department)
  ) {
    return errorResponse(
      "Fields name, email, role, and department are required",
      400
    )
  }

  if (!isValidMemberStatus(body.status)) {
    return errorResponse('Field status must be "active" or "inactive"', 400)
  }

  if (body.joinDate !== undefined && body.joinDate !== "") {
    if (
      typeof body.joinDate !== "string" ||
      Number.isNaN(new Date(body.joinDate).getTime())
    ) {
      return errorResponse("Field joinDate must be a valid datetime string", 400)
    }
  }

  const members = createMember({
    name: body.name,
    email: body.email,
    role: body.role,
    department: body.department,
    status: body.status,
    joinDate: body.joinDate,
  })

  return okResponse(members, "Success create member", 201)
}

