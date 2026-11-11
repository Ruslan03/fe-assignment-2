import type * as React from "react"
import { cn } from "cn"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@atoms/select"

import { LeadingIconControl } from "./leading-icon-control"

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface IconSelectProps {
  icon?: React.ReactNode
  options: SelectOption[]
  placeholder?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  disabled?: boolean
  required?: boolean
  id?: string
  ariaLabel?: string
  "aria-invalid"?: boolean
  size?: "sm" | "default"
  className?: string
  containerClassName?: string
  iconClassName?: string
}

export function IconSelect({
  icon,
  options,
  placeholder,
  value,
  defaultValue,
  onValueChange,
  name,
  disabled,
  required,
  id,
  ariaLabel,
  "aria-invalid": ariaInvalid,
  size = "default",
  className,
  containerClassName,
  iconClassName,
}: IconSelectProps) {
  return (
    <LeadingIconControl
      icon={icon}
      disabled={disabled}
      containerClassName={containerClassName}
      iconClassName={iconClassName}
      slotName="icon-select"
    >
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        name={name}
        disabled={disabled}
        required={required}
      >
        <SelectTrigger
          id={id}
          size={size}
          aria-label={ariaLabel}
          aria-invalid={ariaInvalid}
          className={cn("w-full", icon && "pl-9", className)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="popper">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </LeadingIconControl>
  )
}

