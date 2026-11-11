import type * as React from "react"
import { cn } from "cn"

import { Label } from "@atoms/label"
import { Text } from "@atoms/text"

export interface FormFieldProps {
  label?: string
  htmlFor?: string
  required?: boolean
  message?: string
  errorMessage?: string
  children: React.ReactNode
  className?: string
  labelClassName?: string
}

export function FormField({
  label,
  htmlFor,
  required = false,
  message,
  errorMessage,
  children,
  className,
  labelClassName,
}: FormFieldProps) {
  const hasError = Boolean(errorMessage)

  return (
    <div
      data-slot="form-field"
      data-invalid={hasError || undefined}
      className={cn("flex flex-col gap-1.5", className)}
    >
      {label && (
        <Label htmlFor={htmlFor} className={cn("gap-1", labelClassName)}>
          <span>{label}</span>
          {required && (
            <span aria-hidden="true" className="text-destructive">
              *
            </span>
          )}
        </Label>
      )}

      {children}

      {errorMessage ? (
        <Text as="p" variant="caption" role="alert" className="text-destructive">
          {errorMessage}
        </Text>
      ) : (
        message && (
          <Text as="p" variant="caption">
            {message}
          </Text>
        )
      )}
    </div>
  )
}

