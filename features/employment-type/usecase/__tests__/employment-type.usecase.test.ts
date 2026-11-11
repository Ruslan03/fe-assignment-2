import { describe, expect, it, vi } from "vitest"

import type { EmploymentType } from "../../domain/employment-type.entity"
import type { IEmploymentTypeRepository } from "../employment-type.repository.interface"
import { getAllEmploymentTypesUseCase } from "../employment-type.usecase"

const MOCK_EMPLOYMENT_TYPES: EmploymentType[] = [
  { id: "emp-001", name: "Full-Time" },
  { id: "emp-002", name: "Part-Time" },
]

describe("getAllEmploymentTypesUseCase", () => {
  it("delegates to repository getAllEmploymentTypes", async () => {
    const getAllEmploymentTypes = vi
      .fn()
      .mockResolvedValue(MOCK_EMPLOYMENT_TYPES)
    const repo: IEmploymentTypeRepository = { getAllEmploymentTypes }

    const result = await getAllEmploymentTypesUseCase(repo)
    expect(getAllEmploymentTypes).toHaveBeenCalledTimes(1)
    expect(result).toEqual(MOCK_EMPLOYMENT_TYPES)
  })
})

