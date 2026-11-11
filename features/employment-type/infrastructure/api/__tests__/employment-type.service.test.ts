import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import type { EmploymentType } from "../../../domain/employment-type.entity"
import { EmploymentTypeService } from "../employment-type.service"

const MOCK_EMPLOYMENT_TYPES: EmploymentType[] = [
  { id: "emp-001", name: "Full-Time" },
  { id: "emp-002", name: "Contract" },
]

describe("EmploymentTypeService", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_BASE_API_URL", "http://localhost:3000/api")
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it("fetches employment types and throws when response is not ok", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi
          .fn()
          .mockResolvedValue({ status: true, data: MOCK_EMPLOYMENT_TYPES }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValue({
          status: false,
          message: "Failed to load employment types",
        }),
      })
    vi.stubGlobal("fetch", fetchMock)

    const service = new EmploymentTypeService()
    const result = await service.getAllEmploymentTypes()

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/api/employment/types"
    )
    expect(result).toEqual(MOCK_EMPLOYMENT_TYPES)

    await expect(service.getAllEmploymentTypes()).rejects.toThrow(
      "Failed to load employment types"
    )
  })
})

