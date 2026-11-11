import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"

import { CopyButton } from "@molecules/copy-button"

describe("CopyButton", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it("copies value to clipboard, invokes callback, and resets copied label after duration", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    const onCopied = vi.fn()
    vi.stubGlobal("navigator", {
      clipboard: { writeText },
    })

    render(
      <CopyButton
        value="mem-2048"
        label="Copy ID"
        copiedLabel="Copied!"
        copiedDurationMs={1500}
        onCopied={onCopied}
      />
    )

    const button = screen.getByRole("button", { name: "Copy ID" })
    expect(button).toHaveAttribute("data-variant", "outline")

    await act(async () => {
      fireEvent.click(button)
      await Promise.resolve()
    })

    expect(writeText).toHaveBeenCalledWith("mem-2048")
    expect(onCopied).toHaveBeenCalledWith("mem-2048")
    expect(screen.getByRole("button", { name: "Copied!" })).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1500)
    })

    expect(screen.getByRole("button", { name: "Copy ID" })).toBeInTheDocument()
  })

  it("handles missing or failing clipboard gracefully without entering copied state", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("Clipboard denied"))
    vi.stubGlobal("navigator", {
      clipboard: { writeText },
    })

    render(<CopyButton value="mem-2048" label="Copy ID" />)

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy ID" }))
      await Promise.resolve()
    })

    expect(screen.getByRole("button", { name: "Copy ID" })).toBeInTheDocument()
  })
})
