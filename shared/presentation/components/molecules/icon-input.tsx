import type * as React from "react"
import { cn } from "cn"
import { CircleX } from "lucide-react"

import { Input } from "@atoms/input"

import { LeadingIconControl } from "./leading-icon-control"

export interface IconInputProps extends React.ComponentProps<typeof Input> {
  icon: React.ReactNode
  onClear?: () => void
  clearLabel?: string
  containerClassName?: string
  iconClassName?: string
}

export function IconInput({
  icon,
  onClear,
  clearLabel = "Clear input",
  className,
  containerClassName,
  iconClassName,
  disabled,
  value,
  ...props
}: IconInputProps) {
  const showClear = Boolean(onClear && !disabled && value)

  return (
    <LeadingIconControl
      icon={icon}
      disabled={disabled}
      containerClassName={containerClassName}
      iconClassName={iconClassName}
      slotName="icon-input"
    >
      <Input
        disabled={disabled}
        value={value}
        className={cn(
          "pl-9",
          onClear && "[&::-webkit-search-cancel-button]:hidden",
          showClear && "pr-9",
          className
        )}
        {...props}
      />
      {showClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label={clearLabel}
          className="absolute right-2.5 flex items-center justify-center rounded-full text-placeholder transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <CircleX className="size-3.5" aria-hidden="true" />
        </button>
      )}
    </LeadingIconControl>
  )
}
