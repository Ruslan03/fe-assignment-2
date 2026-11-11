import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"

vi.mock("@/features/user/presentation/components/user-info", () => ({
  default: () => <div data-testid="mock-user-info">User Info</div>,
}))

import * as memberController from "@/features/member/controller/member.controller"
import { fetchMembers, setSearch } from "@/features/member/presentation/store"
import { store } from "@/shared/presentation/store"
import { ReduxProvider } from "@/shared/presentation/store/provider"
import { HomePage } from "@pages/home"

describe("HomePage", () => {
  beforeEach(() => {
    store.dispatch(setSearch(""))
    store.dispatch(fetchMembers.fulfilled([], "", undefined))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("renders Members Directory header, Add Member button, and MemberList", async () => {
    vi.spyOn(memberController, "getAllMemberController").mockResolvedValueOnce([
      {
        id: "mem-001",
        name: "Ruslan Wanandi",
        email: "ruslan.wanandi@company.com",
        role: "Front-end Engineer",
        department: "Engineering",
        status: "active",
        joinDate: "2025-03-10T09:00:00.000Z",
      },
    ])

    await act(async () => {
      render(
        <ReduxProvider>
          <HomePage />
        </ReduxProvider>
      )
    })

    expect(screen.getByTestId("mock-user-info")).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 1, name: "Members Directory" })
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Add Member" })).toHaveAttribute(
      "href",
      "/members/new"
    )
    expect(screen.getByText("Ruslan Wanandi")).toBeInTheDocument()
  })
})

