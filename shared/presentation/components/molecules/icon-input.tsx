import type * as React from "react"
import { cn } from "cn"

import { Input } from "@atoms/input"

import { LeadingIconControl } from "./leading-icon-control"

export interface IconInputProps extends React.ComponentProps<typeof Input> {
  icon: React.ReactNode
  containerClassName?: string
  iconClassName?: string
}

export function IconInput({
  icon,
  className,
  containerClassName,
  iconClassName,
  disabled,
  ...props
}: IconInputProps) {
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
        className={cn("pl-9", className)}
        {...props}
      />
    </LeadingIconControl>
  )
}
