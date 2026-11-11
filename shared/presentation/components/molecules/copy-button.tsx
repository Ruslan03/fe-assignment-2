"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"

import { Button } from "@atoms/button"

export interface CopyButtonProps extends Omit<
  React.ComponentProps<typeof Button>,
  "children" | "onClick"
> {
  value: string
  label?: string
  copiedLabel?: string
  copiedDurationMs?: number
  onCopied?: (value: string) => void
}

/** Domain-agnostic button molecule that copies a text value to the clipboard with feedback state. */
export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  copiedDurationMs = 2000,
  onCopied,
  variant = "outline",
  ...props
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleCopy = async () => {
    try {
      if (!navigator?.clipboard?.writeText) return
      await navigator.clipboard.writeText(value)
      setIsCopied(true)
      onCopied?.(value)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setIsCopied(false)
        timeoutRef.current = null
      }, copiedDurationMs)
    } catch {
      setIsCopied(false)
    }
  }

  return (
    <Button type="button" variant={variant} onClick={handleCopy} {...props}>
      {isCopied ? <Check /> : <Copy />}
      {isCopied ? copiedLabel : label}
    </Button>
  )
}
