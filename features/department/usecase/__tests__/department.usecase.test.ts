import { describe, expect, it, vi } from "vitest"

import type { DepartmentType } from "../../domain/department.entity"
import type { IDepartmentRepository } from "../department.repository.interface"
import { getAllDepartmentsUseCase } from "../department.usecase"

const MOCK_DEPARTMENTS: DepartmentType[] = [
  { id: "dept-001", name: "Engineering" },
  { id: "dept-002", name: "Design" },
]

describe("getAllDepartmentsUseCase", () => {
  it("delegates to repository getAllDepartments", async () => {
    const getAllDepartments = vi.fn().mockResolvedValue(MOCK_DEPARTMENTS)
    const repo: IDepartmentRepository = { getAllDepartments }

    const result = await getAllDepartmentsUseCase(repo)
    expect(getAllDepartments).toHaveBeenCalledTimes(1)
    expect(result).toEqual(MOCK_DEPARTMENTS)
  })
})

