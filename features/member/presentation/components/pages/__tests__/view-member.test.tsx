import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"

vi.mock("@user/presentation/components/user-info", () => ({
  default: () => <div data-testid="mock-user-info">User Info</div>,
}))

import * as analyticsController from "@analytics/controller/analytics.controller"
import { clearMemberAnalytics } from "@analytics/presentation/store"
import * as departmentController from "@department/controller/department.controller"
import * as employmentTypeController from "@employment-type/controller/employment-type.controller"
import * as memberController from "@member/controller/member.controller"
import type { MemberType } from "@member/domain/member.entity"
import {
  clearSelectedMember,
  clearUpdateError,
} from "@member/presentation/store"
import { store } from "@/shared/presentation/store"
import { ReduxProvider } from "@/shared/presentation/store/provider"

import { ViewMemberPage } from "../view-member"

describe("ViewMemberPage", () => {
  beforeEach(() => {
    store.dispatch(clearSelectedMember())
    store.dispatch(clearUpdateError())
    store.dispatch(clearMemberAnalytics())

    vi.spyOn(
      departmentController,
      "getAllDepartmentController"
    ).mockResolvedValue([{ id: "dept-001", name: "Engineering" }])
    vi.spyOn(
      employmentTypeController,
      "getAllEmploymentTypeController"
    ).mockResolvedValue([{ id: "emp-001", name: "Full-Time" }])
    vi.spyOn(
      analyticsController,
      "getMemberAnalyticsController"
    ).mockResolvedValue({
      totalRepository: 42,
      totalDeployment: 1489,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("renders MemberDetailHeader, MemberProfileCard, analytics stats, and edit MemberForm", async () => {
    const controllerSpy = vi
      .spyOn(memberController, "getMemberByIdController")
      .mockResolvedValueOnce({
        id: "mem-001",
        name: "Ruslan Wanandi",
        email: "ruslan.wanandi@company.com",
        role: "Front-end Engineer",
        department: "Engineering",
        employmentType: "Full-Time",
        bio: "Frontend architecture lead.",
        status: "active",
        joinDate: "2025-03-10T09:00:00.000Z",
      })

    await act(async () => {
      render(
        <ReduxProvider>
          <ViewMemberPage memberId="mem-001" />
        </ReduxProvider>
      )
      await Promise.resolve()
    })

    expect(screen.getByTestId("mock-user-info")).toBeInTheDocument()
    expect(controllerSpy).toHaveBeenCalledWith("mem-001")
    expect(
      screen.getByRole("heading", { level: 1, name: /Ruslan Wanandi/i })
    ).toBeInTheDocument()
    expect(screen.getByText("Active")).toBeInTheDocument()
    expect(screen.getByText("ID: #MEM-001")).toBeInTheDocument()
    expect(screen.getByText("Joined March 2025")).toBeInTheDocument()
    expect(screen.getByText("RW")).toBeInTheDocument()
    expect(screen.getByText("42")).toBeInTheDocument()
    expect(screen.getByText("1,489")).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Full Name" })).toHaveValue(
      "Ruslan Wanandi"
    )
    expect(
      screen.getByRole("textbox", { name: "Bio & Administrative Notes" })
    ).toHaveValue("Frontend architecture lead.")
    expect(
      screen.getByRole("combobox", { name: "Employment Type" })
    ).toHaveTextContent("Full-Time")
    expect(
      screen.getByRole("button", { name: "Delete Member" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Save Changes" })
    ).toBeInTheDocument()
  })

  it("renders a centered loading spinner on the page instead of loading text in the header while fetching member details", async () => {
    let resolvePending!: (member: MemberType) => void
    const pendingPromise = new Promise<MemberType>((resolve) => {
      resolvePending = resolve
    })

    vi.spyOn(memberController, "getMemberByIdController").mockReturnValueOnce(
      pendingPromise
    )

    render(
      <ReduxProvider>
        <ViewMemberPage memberId="mem-001" />
      </ReduxProvider>
    )

    expect(screen.queryByRole("heading")).not.toBeInTheDocument()

    const spinner = screen.getByRole("status", {
      name: "Loading member details...",
    })
    expect(spinner).toBeInTheDocument()
    expect(spinner.parentElement).toHaveClass(
      "flex-1",
      "items-center",
      "justify-center"
    )
    expect(screen.getByText("Loading member details...")).toBeInTheDocument()

    await act(async () => {
      resolvePending({
        id: "mem-001",
        name: "Ruslan Wanandi",
        email: "ruslan.wanandi@company.com",
        role: "Front-end Engineer",
        department: "Engineering",
        employmentType: "Full-Time",
        bio: "Frontend architecture lead.",
        status: "active",
        joinDate: "2025-03-10T09:00:00.000Z",
      })
      await Promise.resolve()
    })

    expect(
      screen.queryByRole("status", { name: "Loading member details..." })
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 1, name: /Ruslan Wanandi/i })
    ).toBeInTheDocument()
  })

  it("renders fallback Member Detail header when memberId is not provided", () => {
    render(
      <ReduxProvider>
        <ViewMemberPage />
      </ReduxProvider>
    )

    expect(
      screen.getByRole("heading", { level: 1, name: "Member Detail" })
    ).toBeInTheDocument()
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Delete Member" })
    ).not.toBeInTheDocument()
  })
})
