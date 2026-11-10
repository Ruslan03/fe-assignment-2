import { okResponse } from "../_mock/response"
import { getDepartments } from "../_mock/store"

export const dynamic = "force-dynamic"

export async function GET(): Promise<Response> {
  const departments = getDepartments()
  return okResponse(departments, "Success get departments")
}

