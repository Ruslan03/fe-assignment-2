import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import * as departmentController from "@department/controller/department.controller"
import * as employmentTypeController from "@employment-type/controller/employment-type.controller"
import { store } from "@/shared/presentation/store"
import { ReduxProvider } from "@/shared/presentation/store/provider"

import * as memberController from "../../../../controller/member.controller"
import { clearCreateError, fetchMembers, setSearch } from "../../../store"
import { CreateMemberForm } from "../create-member-form"

describe("CreateMemberForm", () => {
  beforeAll(() => {
    if (!Element.prototype.scrollIntoView) {
      Element.prototype.scrollIntoView = () => {}
    }
    if (!Element.prototype.hasPointerCapture) {
      Element.prototype.hasPointerCapture = () => false
    }
  })

  beforeEach(() => {
    store.dispatch(setSearch(""))
    store.dispatch(fetchMembers.fulfilled([], "", undefined))
    store.dispatch(clearCreateError())

    vi.spyOn(
      departmentController,
      "getAllDepartmentController"
    ).mockResolvedValue([
      { id: "dept-001", name: "Engineering" },
      { id: "dept-002", name: "Design" },
    ])

    vi.spyOn(
      employmentTypeController,
      "getAllEmploymentTypeController"
    ).mockResolvedValue([
      { id: "emp-001", name: "Full-Time" },
      { id: "emp-003", name: "Contract" },
    ])
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("validates required fields via react-hook-form and zod before submitting", async () => {
    const createSpy = vi.spyOn(memberController, "createMemberController")

    render(
      <ReduxProvider>
        <CreateMemberForm />
      </ReduxProvider>
    )

    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }))

    expect(await screen.findByText("Full name is required")).toBeInTheDocument()
    expect(screen.getByText("Work email is required")).toBeInTheDocument()
    expect(screen.getByText("Job title is required")).toBeInTheDocument()
    expect(screen.getByText("Department is required")).toBeInTheDocument()
    expect(createSpy).not.toHaveBeenCalled()
  })

  it("disables action buttons while submitting and shows success dialog on completion", async () => {
    let resolveCreate!: (value: Awaited<ReturnType<typeof memberController.createMemberController>>) => void
    const pendingCreate = new Promise<
      Awaited<ReturnType<typeof memberController.createMemberController>>
    >((resolve) => {
      resolveCreate = resolve
    })

    const createSpy = vi
      .spyOn(memberController, "createMemberController")
      .mockReturnValueOnce(pendingCreate)

    render(
      <ReduxProvider>
        <CreateMemberForm />
      </ReduxProvider>
    )

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: "Department" })
      ).not.toBeDisabled()
    })

    fireEvent.change(screen.getByRole("textbox", { name: "Full Name" }), {
      target: { value: "Michael Phelps" },
    })
    fireEvent.change(screen.getByRole("textbox", { name: "Work Email" }), {
      target: { value: "michael.phelps@acme.corp" },
    })
    fireEvent.change(screen.getByRole("textbox", { name: "Job Title" }), {
      target: { value: "Staff UI/UX Designer" },
    })

    fireEvent.click(screen.getByRole("combobox", { name: "Department" }))
    fireEvent.click(await screen.findByRole("option", { name: "Design" }))

    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }))

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledWith({
        name: "Michael Phelps",
        email: "michael.phelps@acme.corp",
        role: "Staff UI/UX Designer",
        department: "Design",
        status: "active",
      })
    })

    expect(screen.getByRole("button", { name: "Save Changes" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled()

    resolveCreate([
      {
        id: "mem-009",
        name: "Michael Phelps",
        email: "michael.phelps@acme.corp",
        role: "Staff UI/UX Designer",
        department: "Design",
        status: "active",
        joinDate: "2026-11-11T00:00:00.000Z",
      },
    ])

    expect(await screen.findByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Member Added Successfully")).toBeInTheDocument()
    expect(screen.getByText("Michael Phelps")).toBeInTheDocument()
    expect(screen.getByText("#MEM-009")).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "Back to Dashboard" })
    ).toHaveAttribute("href", "/")
  })

  it("shows API error alert when createMember fails", async () => {
    vi.spyOn(memberController, "createMemberController").mockRejectedValueOnce(
      new Error("Server unavailable")
    )

    render(
      <ReduxProvider>
        <CreateMemberForm />
      </ReduxProvider>
    )

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: "Department" })
      ).not.toBeDisabled()
    })

    fireEvent.change(screen.getByRole("textbox", { name: "Full Name" }), {
      target: { value: "Michael Phelps" },
    })
    fireEvent.change(screen.getByRole("textbox", { name: "Work Email" }), {
      target: { value: "michael.phelps@acme.corp" },
    })
    fireEvent.change(screen.getByRole("textbox", { name: "Job Title" }), {
      target: { value: "Staff UI/UX Designer" },
    })

    fireEvent.click(screen.getByRole("combobox", { name: "Department" }))
    fireEvent.click(await screen.findByRole("option", { name: "Engineering" }))

    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }))

    expect(await screen.findByText("Server unavailable")).toBeInTheDocument()
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })
})

