import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import type { DepartmentType } from "../../../domain/department.entity"
import { DepartmentService } from "../department.service"

const MOCK_DEPARTMENTS: DepartmentType[] = [
  { id: "dept-001", name: "Engineering" },
  { id: "dept-002", name: "Design" },
]

describe("DepartmentService", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_BASE_API_URL", "http://localhost:3000/api")
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it("fetches departments and throws when response is not ok", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi
          .fn()
          .mockResolvedValue({ status: true, data: MOCK_DEPARTMENTS }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValue({
          status: false,
          message: "Failed to load departments",
        }),
      })
    vi.stubGlobal("fetch", fetchMock)

    const service = new DepartmentService()
    const result = await service.getAllDepartments()

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/api/departments"
    )
    expect(result).toEqual(MOCK_DEPARTMENTS)

    await expect(service.getAllDepartments()).rejects.toThrow(
      "Failed to load departments"
    )
  })
})

