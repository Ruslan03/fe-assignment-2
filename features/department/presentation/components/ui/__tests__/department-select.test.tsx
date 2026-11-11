import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"

import * as departmentController from "@department/controller/department.controller"
import { DepartmentSelect } from "../department-select"

describe("DepartmentSelect", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("loads departments from controller and populates select options", async () => {
    const spy = vi
      .spyOn(departmentController, "getAllDepartmentController")
      .mockResolvedValueOnce([
        { id: "dept-001", name: "Engineering" },
        { id: "dept-002", name: "Design" },
      ])

    render(<DepartmentSelect required value="Design" />)

    const trigger = screen.getByRole("combobox", { name: "Department" })
    expect(trigger).toBeDisabled()

    await waitFor(() => {
      expect(trigger).not.toBeDisabled()
    })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(trigger).toHaveTextContent("Design")
    expect(screen.getByText("*")).toBeInTheDocument()
  })
})
