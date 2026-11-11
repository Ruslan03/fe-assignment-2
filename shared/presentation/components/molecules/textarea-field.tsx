import * as React from "react"

import { Textarea } from "@atoms/textarea"

import { FormField, type FormFieldProps } from "./form-field"

export interface TextareaFieldProps
  extends Omit<React.ComponentProps<typeof Textarea>, "required">,
    Pick<
      FormFieldProps,
      "label" | "required" | "message" | "errorMessage" | "labelClassName"
    > {
  fieldClassName?: string
}

export function TextareaField({
  id,
  label,
  required,
  message,
  errorMessage,
  fieldClassName,
  labelClassName,
  "aria-invalid": ariaInvalid,
  ...textareaProps
}: TextareaFieldProps) {
  const generatedId = React.useId()
  const textareaId = id ?? generatedId
  const isInvalid = ariaInvalid ?? Boolean(errorMessage)

  return (
    <FormField
      label={label}
      htmlFor={textareaId}
      required={required}
      message={message}
      errorMessage={errorMessage}
      className={fieldClassName}
      labelClassName={labelClassName}
    >
      <Textarea
        id={textareaId}
        required={required}
        aria-invalid={isInvalid}
        {...textareaProps}
      />
    </FormField>
  )
}

