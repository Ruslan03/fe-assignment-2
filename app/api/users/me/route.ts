import { okResponse } from "../../_mock/response"
import { getCurrentUser } from "../../_mock/store"

export const dynamic = "force-dynamic"

export async function GET(): Promise<Response> {
  const user = getCurrentUser()
  return okResponse(user, "Success get current user")
}

