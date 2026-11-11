import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"

import { store } from "@/shared/presentation/store"
import { ReduxProvider } from "@/shared/presentation/store/provider"

import * as memberController from "../../../controller/member.controller"
import type { MemberType } from "../../../domain/member.entity"
import { fetchMembers, setSearch } from "../../store"
import { MemberList } from "../member-list"

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

describe("MemberList", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    store.dispatch(setSearch(""))
    store.dispatch(fetchMembers.fulfilled([], "", undefined))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it("loads members from Redux store and updates search with debounce", async () => {
    const controllerSpy = vi
      .spyOn(memberController, "getAllMemberController")
      .mockResolvedValueOnce(MOCK_MEMBERS)
      .mockResolvedValueOnce([MOCK_MEMBERS[0]])

    render(
      <ReduxProvider>
        <MemberList />
      </ReduxProvider>
    )

    await act(async () => {
      await Promise.resolve()
    })

    expect(controllerSpy).toHaveBeenNthCalledWith(1, undefined)
    expect(screen.getByText("Ruslan Wanandi")).toBeInTheDocument()
    expect(screen.getByText("Dimas Nugroho")).toBeInTheDocument()
    expect(screen.getByText("Mar 10, 2025")).toBeInTheDocument()
    expect(screen.getAllByRole("button", { name: "Edit" })).toHaveLength(2)
    expect(
      screen.getByRole("button", { name: "Delete Ruslan Wanandi" })
    ).toBeInTheDocument()

    const searchInput = screen.getByRole("searchbox", {
      name: "Search members",
    })
    fireEvent.change(searchInput, { target: { value: "Ruslan" } })

    expect(store.getState().member?.search).toBe("Ruslan")
    expect(controllerSpy).toHaveBeenCalledTimes(1)

    await act(async () => {
      vi.advanceTimersByTime(1000)
      await Promise.resolve()
    })

    expect(controllerSpy).toHaveBeenNthCalledWith(2, "Ruslan")
    expect(screen.getByText("Ruslan Wanandi")).toBeInTheDocument()
    expect(screen.queryByText("Dimas Nugroho")).not.toBeInTheDocument()
  })

  it("renders loading, error, empty, and non-ISO joinDate fallback states", async () => {
    let resolvePending!: (value: MemberType[]) => void
    const pendingPromise = new Promise<MemberType[]>((resolve) => {
      resolvePending = resolve
    })

    const controllerSpy = vi
      .spyOn(memberController, "getAllMemberController")
      .mockReturnValueOnce(pendingPromise)

    render(
      <ReduxProvider>
        <MemberList />
      </ReduxProvider>
    )

    expect(screen.getByText("Loading members...")).toBeInTheDocument()

    await act(async () => {
      resolvePending([])
      await Promise.resolve()
    })

    expect(screen.getByText("No members found.")).toBeInTheDocument()

    controllerSpy.mockResolvedValueOnce([
      {
        ...MOCK_MEMBERS[0],
        joinDate: "TBD",
      },
    ])

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search members" }),
      { target: { value: "tbd" } }
    )

    await act(async () => {
      vi.advanceTimersByTime(1000)
      await Promise.resolve()
    })

    expect(screen.getByText("TBD")).toBeInTheDocument()

    controllerSpy.mockRejectedValueOnce(new Error("Failed to load"))

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search members" }),
      { target: { value: "err" } }
    )

    await act(async () => {
      vi.advanceTimersByTime(1000)
      await Promise.resolve()
    })

    expect(screen.getByText("Failed to load")).toBeInTheDocument()
  })
})

