'use client'

import { useCallback } from "react"
import { Building2 } from "lucide-react"

import { useAsyncOptions } from "@/shared/presentation/hooks/use-async-options"
import { SelectField, type SelectFieldProps } from "@molecules/select-field"

import { getAllDepartmentController } from "../../../controller/department.controller"

export interface DepartmentSelectProps
  extends Omit<SelectFieldProps, "options" | "label" | "placeholder"> {
  label?: string
  placeholder?: string
}

export function DepartmentSelect({
  label = "Department",
  placeholder,
  icon = <Building2 />,
  disabled,
  ...props
}: DepartmentSelectProps) {
  const fetchDepartments = useCallback(() => getAllDepartmentController(), [])
  const { options, isLoading } = useAsyncOptions(fetchDepartments)

  return (
    <SelectField
      label={label}
      icon={icon}
      options={options}
      disabled={disabled || isLoading}
      placeholder={
        placeholder ??
        (isLoading ? "Loading departments..." : "Select department")
      }
      {...props}
    />
  )
}

