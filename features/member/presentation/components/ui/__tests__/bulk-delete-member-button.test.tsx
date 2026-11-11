import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"

import { store } from "@/shared/presentation/store"
import { ReduxProvider } from "@/shared/presentation/store/provider"

import * as memberController from "../../../../controller/member.controller"
import type { MemberType } from "../../../../domain/member.entity"
import { clearBulkDeleteError, fetchMembers, setSearch } from "../../../store"
import { BulkDeleteMemberButton } from "../bulk-delete-member-button"

const MOCK_MEMBERS: MemberType[] = [
  {
    id: "mem-001",
    name: "Ruslan Wanandi",
    email: "ruslan.wanandi@company.com",
    role: "Front-end Engineer",
    department: "Engineering",
    status: "active",
    joinDate: "2025-03-10T09:00:00.000Z",
  },
  {
    id: "mem-002",
    name: "Dimas Nugroho",
    email: "dimas.nugroho@company.com",
    role: "QA Engineer",
    department: "Engineering",
    status: "inactive",
    joinDate: "2026-04-12T09:00:00.000Z",
  },
]

describe("BulkDeleteMemberButton", () => {
  beforeEach(() => {
    store.dispatch(setSearch(""))
    store.dispatch(fetchMembers.fulfilled(MOCK_MEMBERS, "", undefined))
    store.dispatch(clearBulkDeleteError())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("renders nothing when no member IDs are selected", () => {
    const { container } = render(
      <ReduxProvider>
        <BulkDeleteMemberButton selectedIds={[]} />
      </ReduxProvider>
    )

    expect(container).toBeEmptyDOMElement()
  })

  it("disables while bulk deleting, calls controller, notifies parent, and shows confirmation dialog", async () => {
    let resolveBulkDelete!: (members: MemberType[]) => void
    const pendingDelete = new Promise<MemberType[]>((resolve) => {
      resolveBulkDelete = resolve
    })

    const spy = vi
      .spyOn(memberController, "bulkDeleteMembersController")
      .mockReturnValueOnce(pendingDelete)
    const onDeleted = vi.fn()

    const { rerender } = render(
      <ReduxProvider>
        <BulkDeleteMemberButton
          selectedIds={["mem-001", "mem-002"]}
          onDeleted={onDeleted}
        />
      </ReduxProvider>
    )

    const button = screen.getByRole("button", { name: "Delete Selected (2)" })
    fireEvent.click(button)

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith({ ids: ["mem-001", "mem-002"] })
      expect(screen.getByRole("button", { name: "Deleting..." })).toBeDisabled()
    })

    await act(async () => {
      resolveBulkDelete([])
      await Promise.resolve()
    })

    expect(onDeleted).toHaveBeenCalledWith(["mem-001", "mem-002"])
    expect(store.getState().member?.items).toEqual([])

    rerender(
      <ReduxProvider>
        <BulkDeleteMemberButton selectedIds={[]} onDeleted={onDeleted} />
      </ReduxProvider>
    )

    expect(await screen.findByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Members Deleted Successfully")).toBeInTheDocument()
    expect(screen.getByText("2 members")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }))

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })
  })
})

