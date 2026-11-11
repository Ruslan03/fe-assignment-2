import { afterEach, describe, expect, it, vi } from "vitest"

import type { DepartmentType } from "../../domain/department.entity"
import { DepartmentService } from "../../infrastructure/api/department.service"
import { getAllDepartmentController } from "../department.controller"

const MOCK_DEPARTMENTS: DepartmentType[] = [
  { id: "dept-001", name: "Engineering" },
]

describe("department.controller", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("fetches departments through DepartmentService and usecase", async () => {
    const spy = vi
      .spyOn(DepartmentService.prototype, "getAllDepartments")
      .mockResolvedValue(MOCK_DEPARTMENTS)

    const departments = await getAllDepartmentController()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(departments).toEqual(MOCK_DEPARTMENTS)
  })
})

