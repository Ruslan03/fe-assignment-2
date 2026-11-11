import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { Mail } from "lucide-react"

import { TextField } from "@molecules/text-field"

describe("TextField", () => {
  it("renders label, required asterisk, leading icon input, and helper message", () => {
    const onChange = vi.fn()

    render(
      <TextField
        label="Work Email"
        required
        icon={<Mail data-testid="mail-icon" />}
        placeholder="michael.phelps@acme.corp"
        message="Used for SSO sign-in."
        onChange={onChange}
      />
    )

    const input = screen.getByRole("textbox", { name: "Work Email" })
    expect(input).toBeRequired()
    expect(input).toHaveClass("pl-9")
    expect(input).toHaveAttribute("aria-invalid", "false")
    expect(screen.getByTestId("mail-icon")).toBeInTheDocument()
    expect(screen.getByText("*")).toBeInTheDocument()
    expect(screen.getByText("Used for SSO sign-in.")).toBeInTheDocument()

    fireEvent.change(input, { target: { value: "alex@acme.corp" } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it("renders plain Input without icon and sets aria-invalid on errorMessage", () => {
    const { container } = render(
      <TextField
        id="username"
        label="Username"
        errorMessage="Username is required"
      />
    )

    const input = screen.getByLabelText("Username")
    expect(input).toHaveAttribute("id", "username")
    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(input).not.toHaveClass("pl-9")
    expect(
      container.querySelector('[data-slot="icon-input"]')
    ).not.toBeInTheDocument()
    expect(screen.getByRole("alert")).toHaveTextContent("Username is required")
  })
})

