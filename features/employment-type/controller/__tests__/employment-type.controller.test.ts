import { afterEach, describe, expect, it, vi } from "vitest"

import type { EmploymentType } from "../../domain/employment-type.entity"
import { EmploymentTypeService } from "../../infrastructure/api/employment-type.service"
import { getAllEmploymentTypeController } from "../employment-type.controller"

const MOCK_EMPLOYMENT_TYPES: EmploymentType[] = [
  { id: "emp-001", name: "Full-Time" },
]

describe("employment-type.controller", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("fetches employment types through EmploymentTypeService and usecase", async () => {
    const spy = vi
      .spyOn(EmploymentTypeService.prototype, "getAllEmploymentTypes")
      .mockResolvedValue(MOCK_EMPLOYMENT_TYPES)

    const types = await getAllEmploymentTypeController()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(types).toEqual(MOCK_EMPLOYMENT_TYPES)
  })
})

