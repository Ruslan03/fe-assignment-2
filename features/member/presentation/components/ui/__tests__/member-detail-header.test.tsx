import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"

import { store } from "@/shared/presentation/store"
import { ReduxProvider } from "@/shared/presentation/store/provider"

import * as memberController from "../../../../controller/member.controller"
import type { MemberType } from "../../../../domain/member.entity"
import { clearSelectedMember } from "../../../store"
import { MemberDetailHeader } from "../member-detail-header"

const MOCK_MEMBER: MemberType = {
  id: "mem-2048",
  name: "Sarah Jenkins",
  email: "sarah.jenkins@acme.corp",
  role: "Staff Frontend Engineer",
  department: "Engineering",
  status: "active",
  joinDate: "2022-03-15T09:00:00.000Z",
}

describe("MemberDetailHeader", () => {
  beforeEach(() => {
    store.dispatch(clearSelectedMember())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it("fetches member by id and displays header with status badge, formatted metadata, and Copy ID button", async () => {
    let resolvePending!: (member: MemberType) => void
    const pendingPromise = new Promise<MemberType>((resolve) => {
      resolvePending = resolve
    })

    const controllerSpy = vi
      .spyOn(memberController, "getMemberByIdController")
      .mockReturnValueOnce(pendingPromise)

    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal("navigator", {
      clipboard: { writeText },
    })

    render(
      <ReduxProvider>
        <MemberDetailHeader memberId="mem-2048" />
      </ReduxProvider>
    )

    expect(controllerSpy).toHaveBeenCalledWith("mem-2048")
    expect(screen.queryByRole("heading")).not.toBeInTheDocument()
    expect(
      screen.queryByText("Loading member details...")
    ).not.toBeInTheDocument()

    await act(async () => {
      resolvePending(MOCK_MEMBER)
      await Promise.resolve()
    })

    expect(
      screen.getByRole("heading", { level: 1, name: /Sarah Jenkins/i })
    ).toBeInTheDocument()
    expect(screen.getByText("Active")).toBeInTheDocument()
    expect(screen.getByText("ID: #MEM-2048")).toBeInTheDocument()
    expect(screen.getByText("Joined March 2022")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Go back" })).toHaveAttribute(
      "href",
      "/"
    )

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy ID" }))
      await Promise.resolve()
    })

    expect(writeText).toHaveBeenCalledWith("mem-2048")
    expect(screen.getByRole("button", { name: "Copied!" })).toBeInTheDocument()
  })

  it("renders inactive status and error state when fetching fails", async () => {
    vi.spyOn(memberController, "getMemberByIdController")
      .mockResolvedValueOnce({
        ...MOCK_MEMBER,
        status: "inactive",
      })
      .mockRejectedValueOnce(new Error("Member not found"))

    const { rerender } = render(
      <ReduxProvider>
        <MemberDetailHeader memberId="mem-2048" />
      </ReduxProvider>
    )

    await act(async () => {
      await Promise.resolve()
    })

    expect(screen.getByText("Inactive")).toBeInTheDocument()

    rerender(
      <ReduxProvider>
        <MemberDetailHeader memberId="missing" />
      </ReduxProvider>
    )

    await act(async () => {
      await Promise.resolve()
    })

    expect(screen.getByText("Member not found")).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Copy ID" })
    ).not.toBeInTheDocument()
  })

  it("renders fallback header without fetching when memberId is absent", () => {
    const controllerSpy = vi.spyOn(memberController, "getMemberByIdController")

    render(
      <ReduxProvider>
        <MemberDetailHeader />
      </ReduxProvider>
    )

    expect(controllerSpy).not.toHaveBeenCalled()
    expect(
      screen.getByRole("heading", { level: 1, name: "Member Detail" })
    ).toBeInTheDocument()
  })
})
