import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { Input } from "@atoms/input"

describe("Input", () => {
  it("renders with data-slot and forwards props", () => {
    const handleChange = vi.fn()

    render(
      <Input
        type="email"
        placeholder="Enter email"
        className="max-w-xs"
        onChange={handleChange}
      />
    )

    const input = screen.getByPlaceholderText("Enter email")
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute("data-slot", "input")
    expect(input).toHaveAttribute("type", "email")
    expect(input).toHaveClass("max-w-xs")

    fireEvent.change(input, { target: { value: "user@example.com" } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it("supports disabled and aria-invalid states", () => {
    render(
      <Input placeholder="Invalid input" disabled aria-invalid="true" />
    )

    const input = screen.getByPlaceholderText("Invalid input")
    expect(input).toBeDisabled()
    expect(input).toHaveAttribute("aria-invalid", "true")
  })
})

