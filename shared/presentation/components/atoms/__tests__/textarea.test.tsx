import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { Textarea } from "@atoms/textarea"

describe("Textarea", () => {
  it("renders textarea with data-slot and handles input", () => {
    const onChange = vi.fn()

    render(
      <Textarea
        placeholder="Write notes..."
        aria-invalid="true"
        className="custom-textarea"
        onChange={onChange}
      />
    )

    const textarea = screen.getByPlaceholderText("Write notes...")
    expect(textarea).toHaveAttribute("data-slot", "textarea")
    expect(textarea).toHaveAttribute("aria-invalid", "true")
    expect(textarea).toHaveClass("custom-textarea")

    fireEvent.change(textarea, { target: { value: "Updated bio" } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})

