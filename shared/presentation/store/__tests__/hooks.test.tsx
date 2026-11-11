import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { store } from "../index"
import { useAppDispatch, useAppSelector } from "../hooks"
import { ReduxProvider } from "../provider"

function VersionBadge() {
  const dispatch = useAppDispatch()
  const version = useAppSelector((state) => state.base.version)

  return (
    <button type="button" onClick={() => dispatch({ type: "TEST_PING" })}>
      v{version}
    </button>
  )
}

describe("Redux store hooks", () => {
  it("provides store state and dispatch via ReduxProvider", () => {
    const dispatchSpy = vi.spyOn(store, "dispatch")

    render(
      <ReduxProvider>
        <VersionBadge />
      </ReduxProvider>
    )

    const button = screen.getByRole("button", { name: "v0.0.1" })
    expect(button).toBeInTheDocument()

    fireEvent.click(button)
    expect(dispatchSpy).toHaveBeenCalledWith({ type: "TEST_PING" })

    dispatchSpy.mockRestore()
  })
})

