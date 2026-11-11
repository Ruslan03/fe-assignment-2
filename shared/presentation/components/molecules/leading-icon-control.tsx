import type * as React from "react"
import { cn } from "cn"

export interface LeadingIconControlProps {
  icon?: React.ReactNode
  disabled?: boolean
  containerClassName?: string
  iconClassName?: string
  slotName?: string
  children: React.ReactNode
}

export function LeadingIconControl({
  icon,
  disabled,
  containerClassName,
  iconClassName,
  slotName = "leading-icon-control",
  children,
}: LeadingIconControlProps) {
  return (
    <div
      data-slot={slotName}
      className={cn("relative flex w-full items-center", containerClassName)}
    >
      {icon && (
        <span
          data-slot={`${slotName}-icon`}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute left-3 flex items-center justify-center text-placeholder [&_svg]:size-3.5 [&_svg]:shrink-0",
            disabled && "opacity-50",
            iconClassName
          )}
        >
          {icon}
        </span>
      )}
      {children}
    </div>
  )
}

