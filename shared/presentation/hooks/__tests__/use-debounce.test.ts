import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, renderHook } from "@testing-library/react"

import { useDebounce } from "../use-debounce"

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns initial value immediately and debounces subsequent updates", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 300 } }
    )

    expect(result.current).toBe("initial")

    rerender({ value: "next", delay: 300 })
    expect(result.current).toBe("initial")

    act(() => {
      vi.advanceTimersByTime(299)
    })
    expect(result.current).toBe("initial")

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe("next")
  })

  it("resets the debounce timer on rapid changes", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 200),
      { initialProps: { value: "a" } }
    )

    rerender({ value: "ab" })
    act(() => {
      vi.advanceTimersByTime(100)
    })

    rerender({ value: "abc" })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toBe("a")

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toBe("abc")
  })

  it("uses 300ms as default delay", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "start" },
    })

    rerender({ value: "end" })
    act(() => {
      vi.advanceTimersByTime(299)
    })
    expect(result.current).toBe("start")

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe("end")
  })

  it("flushes immediately on the next microtask when immediateWhen matches", async () => {
    const { result, rerender } = renderHook(
      ({ value }) =>
        useDebounce(value, 1000, {
          immediateWhen: (current) => current === "",
        }),
      { initialProps: { value: "initial" } }
    )

    rerender({ value: "updated" })
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current).toBe("updated")

    rerender({ value: "" })
    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current).toBe("")
  })
})

