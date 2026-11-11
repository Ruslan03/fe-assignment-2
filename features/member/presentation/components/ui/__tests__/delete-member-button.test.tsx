import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"

import { store } from "@/shared/presentation/store"
import { ReduxProvider } from "@/shared/presentation/store/provider"

import * as memberController from "../../../../controller/member.controller"
import type { MemberType } from "../../../../domain/member.entity"
import { clearDeleteError, fetchMembers } from "../../../store"
import { DeleteMemberButton } from "../delete-member-button"

const MOCK_MEMBER: MemberType = {
  id: "mem-2048",
  name: "Sarah Jenkins",
  email: "sarah.jenkins@acme.corp",
  role: "Staff Frontend Engineer",
  department: "Engineering",
  status: "active",
  joinDate: "2022-03-15T09:00:00.000Z",
}

describe("DeleteMemberButton", () => {
  beforeEach(() => {
    store.dispatch(fetchMembers.fulfilled([MOCK_MEMBER], "", undefined))
    store.dispatch(clearDeleteError())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("disables while deleting, shows Member Deleted Successfully dialog, and removes member on Dismiss", async () => {
    let resolveDelete!: (member: MemberType) => void
    const pendingDelete = new Promise<MemberType>((resolve) => {
      resolveDelete = resolve
    })

    const spy = vi
      .spyOn(memberController, "deleteMemberController")
      .mockReturnValueOnce(pendingDelete)
    const onDeleted = vi.fn()

    render(
      <ReduxProvider>
        <DeleteMemberButton member={MOCK_MEMBER} onDeleted={onDeleted} />
      </ReduxProvider>
    )

    const button = screen.getByRole("button", { name: "Delete Member" })
    fireEvent.click(button)

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith("mem-2048")
      expect(button).toBeDisabled()
    })

    await act(async () => {
      resolveDelete(MOCK_MEMBER)
      await Promise.resolve()
    })

    expect(await screen.findByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Member Deleted Successfully")).toBeInTheDocument()
    expect(screen.getByText("Sarah Jenkins")).toBeInTheDocument()
    expect(screen.getByText("#MEM-2048")).toBeInTheDocument()
    expect(store.getState().member?.items).toHaveLength(1)

    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }))

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })
    expect(store.getState().member?.items).toEqual([])
    expect(onDeleted).toHaveBeenCalledWith(MOCK_MEMBER)
  })

  it("supports iconOnly trigger and Dismiss link when dismissHref is provided", async () => {
    vi.spyOn(memberController, "deleteMemberController").mockResolvedValueOnce(
      MOCK_MEMBER
    )

    render(
      <ReduxProvider>
        <DeleteMemberButton
          member={MOCK_MEMBER}
          iconOnly
          dismissHref="/"
          variant="ghost"
          size="icon-sm"
        />
      </ReduxProvider>
    )

    const button = screen.getByRole("button", { name: "Delete Sarah Jenkins" })
    await act(async () => {
      fireEvent.click(button)
      await Promise.resolve()
    })

    const dismissLink = await screen.findByRole("link", { name: "Dismiss" })
    expect(dismissLink).toHaveAttribute("href", "/")

    fireEvent.click(dismissLink)
    expect(store.getState().member?.items).toEqual([])
  })
})

