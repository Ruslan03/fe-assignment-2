import * as React from "react"

import { FormField, type FormFieldProps } from "./form-field"
import { IconSelect, type IconSelectProps } from "./icon-select"

export interface SelectFieldProps
  extends Omit<IconSelectProps, "required">,
    Pick<
      FormFieldProps,
      "label" | "required" | "message" | "errorMessage" | "labelClassName"
    > {
  fieldClassName?: string
}

export function SelectField({
  id,
  label,
  required,
  message,
  errorMessage,
  fieldClassName,
  labelClassName,
  "aria-invalid": ariaInvalid,
  ...selectProps
}: SelectFieldProps) {
  const generatedId = React.useId()
  const selectId = id ?? generatedId
  const isInvalid = ariaInvalid ?? Boolean(errorMessage)

  return (
    <FormField
      label={label}
      htmlFor={selectId}
      required={required}
      message={message}
      errorMessage={errorMessage}
      className={fieldClassName}
      labelClassName={labelClassName}
    >
      <IconSelect
        id={selectId}
        required={required}
        aria-invalid={isInvalid}
        {...selectProps}
      />
    </FormField>
  )
}

