import { describe, expect, it, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"

import { useAsyncOptions } from "../use-async-options"

describe("useAsyncOptions", () => {
  it("loads options from fetcher and maps name to label/value", async () => {
    const fetcher = vi.fn().mockResolvedValue([
      { id: "1", name: "Engineering" },
      { id: "2", name: "Design" },
    ])

    const { result } = renderHook(() => useAsyncOptions(fetcher))

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.options).toEqual([
      { label: "Engineering", value: "Engineering" },
      { label: "Design", value: "Design" },
    ])
  })

  it("falls back to empty options when fetcher rejects", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("Network failure"))

    const { result } = renderHook(() => useAsyncOptions(fetcher))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.options).toEqual([])
  })
})

