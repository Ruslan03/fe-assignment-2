import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"

import * as employmentTypeController from "@employment-type/controller/employment-type.controller"
import { EmploymentTypeSelect } from "../employment-type-select"

describe("EmploymentTypeSelect", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("loads employment types from controller and populates select options", async () => {
    const spy = vi
      .spyOn(employmentTypeController, "getAllEmploymentTypeController")
      .mockResolvedValueOnce([
        { id: "emp-001", name: "Full-Time" },
        { id: "emp-003", name: "Contract" },
      ])

    render(<EmploymentTypeSelect value="Contract" />)

    const trigger = screen.getByRole("combobox", { name: "Employment Type" })
    expect(trigger).toBeDisabled()

    await waitFor(() => {
      expect(trigger).not.toBeDisabled()
    })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(trigger).toHaveTextContent("Contract")
  })
})
