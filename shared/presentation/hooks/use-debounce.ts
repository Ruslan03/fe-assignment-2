'use client'

import { useEffect, useState } from "react"

export interface UseDebounceOptions<T> {
  /** When true for the latest value, updates the debounced value on the next microtask instead of waiting for `delay`. */
  immediateWhen?: (value: T) => boolean
}

/** Returns a debounced copy of `value` after `delay` ms of inactivity. */
export function useDebounce<T>(
  value: T,
  delay = 300,
  options?: UseDebounceOptions<T>
): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const shouldFlushImmediately = Boolean(options?.immediateWhen?.(value))

  useEffect(() => {
    if (shouldFlushImmediately) {
      let cancelled = false
      void Promise.resolve().then(() => {
        if (!cancelled) {
          setDebouncedValue(value)
        }
      })

      return () => {
        cancelled = true
      }
    }

    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay, shouldFlushImmediately])

  return debouncedValue
}

