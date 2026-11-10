import { okResponse } from "../../_mock/response"
import { getEmploymentTypes } from "../../_mock/store"

export const dynamic = "force-dynamic"

export async function GET(): Promise<Response> {
  const types = getEmploymentTypes()
  return okResponse(types, "Success get employment types")
}

