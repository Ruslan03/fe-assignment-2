import * as React from "react"
import { cn } from "cn"

import { Input } from "../atoms/input"

export interface IconInputProps extends React.ComponentProps<typeof Input> {
  icon: React.ReactNode
  containerClassName?: string
  iconClassName?: string
}

/** Molecule combining a leading left icon with the Input atom. */
export function IconInput({
  icon,
  className,
  containerClassName,
  iconClassName,
  disabled,
  ...props
}: IconInputProps) {
  return (
    <div
      data-slot="icon-input"
      className={cn("relative flex w-full items-center", containerClassName)}
    >
      <span
        data-slot="icon-input-icon"
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-3 flex items-center justify-center text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0",
          disabled && "opacity-50",
          iconClassName
        )}
      >
        {icon}
      </span>
      <Input
        disabled={disabled}
        className={cn("pl-9", className)}
        {...props}
      />
    </div>
  )
}

