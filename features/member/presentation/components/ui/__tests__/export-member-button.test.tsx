import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"

import { store } from "@/shared/presentation/store"
import { ReduxProvider } from "@/shared/presentation/store/provider"

import * as memberController from "../../../../controller/member.controller"
import type { MemberType } from "../../../../domain/member.entity"
import { clearExportError, setSearch } from "../../../store"
import { ExportMemberButton } from "../export-member-button"

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
]

describe("ExportMemberButton", () => {
  beforeEach(() => {
    store.dispatch(setSearch("active-search-filter"))
    store.dispatch(clearExportError())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("dispatches exportMembersCsv ignoring search query and disables button while exporting", async () => {
    let resolveExport!: (members: MemberType[]) => void
    const pendingExport = new Promise<MemberType[]>((resolve) => {
      resolveExport = resolve
    })

    const spy = vi
      .spyOn(memberController, "exportMembersCsvController")
      .mockReturnValueOnce(pendingExport)

    render(
      <ReduxProvider>
        <ExportMemberButton />
      </ReduxProvider>
    )

    const button = screen.getByRole("button", { name: "Export CSV" })
    expect(button).toHaveAttribute("data-variant", "outline")

    fireEvent.click(button)

    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith()
      expect(
        screen.getByRole("button", { name: "Exporting..." })
      ).toBeDisabled()
    })

    await act(async () => {
      resolveExport(MOCK_MEMBERS)
      await Promise.resolve()
    })

    expect(
      screen.getByRole("button", { name: "Export CSV" })
    ).not.toBeDisabled()
    expect(store.getState().member?.search).toBe("active-search-filter")
  })

  it("shows error alert when exportMembersCsv fails", async () => {
    vi.spyOn(
      memberController,
      "exportMembersCsvController"
    ).mockRejectedValueOnce(new Error("Export failed"))

    render(
      <ReduxProvider>
        <ExportMemberButton />
      </ReduxProvider>
    )

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Export CSV" }))
      await Promise.resolve()
    })

    expect(screen.getByRole("alert")).toHaveTextContent("Export failed")
  })
})

