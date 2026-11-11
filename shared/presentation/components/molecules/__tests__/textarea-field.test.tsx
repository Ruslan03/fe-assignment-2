import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { TextareaField } from "@molecules/textarea-field"

describe("TextareaField", () => {
  it("renders label, textarea, message, and error state", () => {
    const onChange = vi.fn()

    const { rerender } = render(
      <TextareaField
        label="Bio & Notes"
        placeholder="Write bio..."
        message="Optional notes."
        onChange={onChange}
      />
    )

    const textarea = screen.getByLabelText("Bio & Notes")
    expect(textarea).toHaveAttribute("aria-invalid", "false")
    expect(screen.getByText("Optional notes.")).toBeInTheDocument()

    fireEvent.change(textarea, { target: { value: "Design lead" } })
    expect(onChange).toHaveBeenCalledTimes(1)

    rerender(
      <TextareaField
        label="Bio & Notes"
        errorMessage="Bio is too long"
      />
    )

    expect(screen.getByLabelText("Bio & Notes")).toHaveAttribute(
      "aria-invalid",
      "true"
    )
    expect(screen.getByRole("alert")).toHaveTextContent("Bio is too long")
  })
})

