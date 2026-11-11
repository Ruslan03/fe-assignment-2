import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import * as departmentController from "@department/controller/department.controller"
import * as employmentTypeController from "@employment-type/controller/employment-type.controller"
import { store } from "@/shared/presentation/store"
import { ReduxProvider } from "@/shared/presentation/store/provider"

import * as memberController from "../../../../controller/member.controller"
import type { MemberType } from "../../../../domain/member.entity"
import {
  clearCreateError,
  clearUpdateError,
  fetchMembers,
  setSearch,
} from "../../../store"
import { MemberForm } from "../member-form"

const EXISTING_MEMBER: MemberType = {
  id: "mem-2048",
  name: "Sarah Jenkins",
  email: "sarah.jenkins@acme.corp",
  role: "Staff Frontend Engineer",
  department: "Engineering",
  employmentType: "Full-Time",
  bio: "Frontend architecture lead responsible for design system integration and core web vitals.",
  status: "active",
  joinDate: "2022-03-15T09:00:00.000Z",
}

describe("MemberForm", () => {
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
    store.dispatch(clearUpdateError())

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
        <MemberForm />
      </ReduxProvider>
    )

    expect(
      screen.getByText(
        "Add personal records, contact credentials, and communication metadata."
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Delete Member" })
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }))

    expect(await screen.findByText("Full name is required")).toBeInTheDocument()
    expect(screen.getByText("Work email is required")).toBeInTheDocument()
    expect(screen.getByText("Job title is required")).toBeInTheDocument()
    expect(screen.getByText("Department is required")).toBeInTheDocument()
    expect(createSpy).not.toHaveBeenCalled()
  })

  it("disables action buttons while creating and shows added success dialog", async () => {
    let resolveCreate!: (
      value: Awaited<ReturnType<typeof memberController.createMemberController>>
    ) => void
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
        <MemberForm />
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

    fireEvent.click(screen.getByRole("combobox", { name: "Employment Type" }))
    fireEvent.click(await screen.findByRole("option", { name: "Contract" }))

    fireEvent.change(
      screen.getByRole("textbox", { name: "Bio & Administrative Notes" }),
      {
        target: {
          value:
            "Mainly working on low fidelity and high fidelity design generation",
        },
      }
    )

    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }))

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledWith({
        name: "Michael Phelps",
        email: "michael.phelps@acme.corp",
        role: "Staff UI/UX Designer",
        department: "Design",
        employmentType: "Contract",
        bio: "Mainly working on low fidelity and high fidelity design generation",
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
        <MemberForm />
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

  it("prefills initialData in edit mode, renders inert Delete Member button, and updates member", async () => {
    let resolveUpdate!: (
      value: Awaited<ReturnType<typeof memberController.updateMemberController>>
    ) => void
    const pendingUpdate = new Promise<
      Awaited<ReturnType<typeof memberController.updateMemberController>>
    >((resolve) => {
      resolveUpdate = resolve
    })

    const updateSpy = vi
      .spyOn(memberController, "updateMemberController")
      .mockReturnValueOnce(pendingUpdate)

    render(
      <ReduxProvider>
        <MemberForm mode="edit" initialData={EXISTING_MEMBER} />
      </ReduxProvider>
    )

    expect(
      screen.getByText(
        "Update personal records, contact credentials, and communication metadata."
      )
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Delete Member" })
    ).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Full Name" })).toHaveValue(
      "Sarah Jenkins"
    )
    expect(screen.getByRole("textbox", { name: "Work Email" })).toHaveValue(
      "sarah.jenkins@acme.corp"
    )
    expect(screen.getByRole("textbox", { name: "Job Title" })).toHaveValue(
      "Staff Frontend Engineer"
    )
    expect(
      screen.getByRole("textbox", { name: "Bio & Administrative Notes" })
    ).toHaveValue(
      "Frontend architecture lead responsible for design system integration and core web vitals."
    )

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: "Department" })
      ).not.toBeDisabled()
      expect(
        screen.getByRole("combobox", { name: "Employment Type" })
      ).not.toBeDisabled()
    })

    expect(
      screen.getByRole("combobox", { name: "Department" })
    ).toHaveTextContent("Engineering")
    expect(
      screen.getByRole("combobox", { name: "Employment Type" })
    ).toHaveTextContent("Full-Time")

    fireEvent.change(screen.getByRole("textbox", { name: "Job Title" }), {
      target: { value: "Principal Frontend Engineer" },
    })

    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }))

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith("mem-2048", {
        name: "Sarah Jenkins",
        email: "sarah.jenkins@acme.corp",
        role: "Principal Frontend Engineer",
        department: "Engineering",
        employmentType: "Full-Time",
        bio: "Frontend architecture lead responsible for design system integration and core web vitals.",
        status: "active",
      })
    })

    expect(screen.getByRole("button", { name: "Save Changes" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Delete Member" })).toBeDisabled()

    resolveUpdate({
      ...EXISTING_MEMBER,
      role: "Principal Frontend Engineer",
    })

    expect(await screen.findByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Member Updated Successfully")).toBeInTheDocument()
    expect(screen.getByText("Sarah Jenkins")).toBeInTheDocument()
    expect(screen.getByText("#MEM-2048")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Continue Editing" }))

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })
  })
})
