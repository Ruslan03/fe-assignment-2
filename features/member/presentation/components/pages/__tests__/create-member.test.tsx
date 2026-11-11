import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"

vi.mock("@user/presentation/components/user-info", () => ({
  default: () => <div data-testid="mock-user-info">User Info</div>,
}))

import * as departmentController from "@department/controller/department.controller"
import * as employmentTypeController from "@employment-type/controller/employment-type.controller"
import { clearCreateError, fetchMembers, setSearch } from "@member/presentation/store"
import { store } from "@/shared/presentation/store"
import { ReduxProvider } from "@/shared/presentation/store/provider"

import { CreateMemberPage } from "../create-member"

describe("CreateMemberPage", () => {
  beforeEach(() => {
    store.dispatch(setSearch(""))
    store.dispatch(fetchMembers.fulfilled([], "", undefined))
    store.dispatch(clearCreateError())

    vi.spyOn(
      departmentController,
      "getAllDepartmentController"
    ).mockResolvedValue([{ id: "dept-001", name: "Engineering" }])
    vi.spyOn(
      employmentTypeController,
      "getAllEmploymentTypeController"
    ).mockResolvedValue([{ id: "emp-001", name: "Full-Time" }])
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("renders Add New Member header with back button and CreateMemberForm", async () => {
    render(
      <ReduxProvider>
        <CreateMemberPage />
      </ReduxProvider>
    )

    expect(
      screen.getByRole("heading", { level: 1, name: "Add New Member" })
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Go back" })).toHaveAttribute(
      "href",
      "/"
    )
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument()
    expect(
      screen.queryByRole("link", { name: "Add Member" })
    ).not.toBeInTheDocument()
    expect(screen.getByText("General Information")).toBeInTheDocument()
    expect(screen.getByText("Work Details & Permissions")).toBeInTheDocument()

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: "Department" })
      ).not.toBeDisabled()
    })
  })
})
