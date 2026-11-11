import * as React from "react"

import { Input } from "@atoms/input"

import { FormField, type FormFieldProps } from "./form-field"
import { IconInput } from "./icon-input"

export interface TextFieldProps
  extends Omit<React.ComponentProps<typeof Input>, "required">,
    Pick<
      FormFieldProps,
      "label" | "required" | "message" | "errorMessage" | "labelClassName"
    > {
  icon?: React.ReactNode
  fieldClassName?: string
  containerClassName?: string
  iconClassName?: string
}

export function TextField({
  id,
  label,
  required,
  message,
  errorMessage,
  icon,
  fieldClassName,
  labelClassName,
  containerClassName,
  iconClassName,
  "aria-invalid": ariaInvalid,
  ...inputProps
}: TextFieldProps) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const isInvalid = ariaInvalid ?? Boolean(errorMessage)

  return (
    <FormField
      label={label}
      htmlFor={inputId}
      required={required}
      message={message}
      errorMessage={errorMessage}
      className={fieldClassName}
      labelClassName={labelClassName}
    >
      {icon ? (
        <IconInput
          id={inputId}
          icon={icon}
          required={required}
          aria-invalid={isInvalid}
          containerClassName={containerClassName}
          iconClassName={iconClassName}
          {...inputProps}
        />
      ) : (
        <Input
          id={inputId}
          required={required}
          aria-invalid={isInvalid}
          {...inputProps}
        />
      )}
    </FormField>
  )
}

