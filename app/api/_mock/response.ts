import { NextResponse } from "next/server"
import type { ApiResponse } from "./types"

export function okResponse<T>(data: T, message: string, statusCode = 200) {
  const body: ApiResponse<T> = {
    status: true,
    message,
    data,
  }
  return NextResponse.json(body, { status: statusCode })
}

export function errorResponse(message: string, statusCode = 400) {
  const body: ApiResponse<null> = {
    status: false,
    message,
    data: null,
  }
  return NextResponse.json(body, { status: statusCode })
}

export async function parseJsonBody<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T
  } catch {
    return null
  }
}

