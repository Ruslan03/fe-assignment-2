'use client'

import { useEffect, useState } from "react"

import type { SelectOption } from "@molecules/icon-select"

export function useAsyncOptions<T extends { name: string }>(
  fetcher: () => Promise<T[]>
) {
  const [options, setOptions] = useState<SelectOption[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    fetcher()
      .then((items) => {
        if (!active) return
        setOptions(
          Array.isArray(items)
            ? items.map((item) => ({ label: item.name, value: item.name }))
            : []
        )
      })
      .catch(() => {
        if (!active) return
        setOptions([])
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [fetcher])

  return { options, isLoading }
}

