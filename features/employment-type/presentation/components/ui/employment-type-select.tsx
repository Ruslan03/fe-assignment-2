'use client'

import { useCallback } from "react"
import { UserCheck } from "lucide-react"

import { useAsyncOptions } from "@/shared/presentation/hooks/use-async-options"
import { SelectField, type SelectFieldProps } from "@molecules/select-field"

import { getAllEmploymentTypeController } from "../../../controller/employment-type.controller"

export interface EmploymentTypeSelectProps
  extends Omit<SelectFieldProps, "options" | "label" | "placeholder"> {
  label?: string
  placeholder?: string
}

export function EmploymentTypeSelect({
  label = "Employment Type",
  placeholder,
  icon = <UserCheck />,
  disabled,
  ...props
}: EmploymentTypeSelectProps) {
  const fetchEmploymentTypes = useCallback(
    () => getAllEmploymentTypeController(),
    []
  )
  const { options, isLoading } = useAsyncOptions(fetchEmploymentTypes)

  return (
    <SelectField
      label={label}
      icon={icon}
      options={options}
      disabled={disabled || isLoading}
      placeholder={
        placeholder ??
        (isLoading ? "Loading employment types..." : "Select employment type")
      }
      {...props}
    />
  )
}

