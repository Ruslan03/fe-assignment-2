import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { FormField } from "@molecules/form-field"

describe("FormField", () => {
  it("renders label, required asterisk, helper message, and children", () => {
    const { container } = render(
      <FormField
        label="Full Name"
        htmlFor="full-name"
        required
        message="Displayed publicly."
      >
        <input id="full-name" />
      </FormField>
    )

    const field = container.querySelector('[data-slot="form-field"]')
    expect(field).not.toHaveAttribute("data-invalid")
    expect(screen.getByRole("textbox", { name: "Full Name" })).toBeInTheDocument()
    expect(screen.getByText("*")).toHaveClass("text-destructive")
    expect(screen.getByText("Displayed publicly.")).toBeInTheDocument()
  })

  it("prioritizes errorMessage over message and marks field invalid", () => {
    const { container } = render(
      <FormField
        label="Email"
        htmlFor="email"
        message="Helper text"
        errorMessage="Email is required"
      >
        <input id="email" />
      </FormField>
    )

    const field = container.querySelector('[data-slot="form-field"]')
    expect(field).toHaveAttribute("data-invalid", "true")
    expect(screen.getByRole("alert")).toHaveTextContent("Email is required")
    expect(screen.queryByText("Helper text")).not.toBeInTheDocument()
  })

  it("omits label, required marker, and messages when not provided", () => {
    const { container } = render(
      <FormField>
        <input aria-label="Bare input" />
      </FormField>
    )

    expect(
      container.querySelector('[data-slot="label"]')
    ).not.toBeInTheDocument()
    expect(screen.queryByText("*")).not.toBeInTheDocument()
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })
})

