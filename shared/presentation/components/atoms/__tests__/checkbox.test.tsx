import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { Checkbox } from "@atoms/checkbox"

describe("Checkbox", () => {
  it("renders unchecked by default and toggles checked state on click", () => {
    const onCheckedChange = vi.fn()

    render(
      <Checkbox
        aria-label="Accept terms"
        onCheckedChange={onCheckedChange}
        className="custom-checkbox"
      />
    )

    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" })
    expect(checkbox).toHaveAttribute("data-slot", "checkbox")
    expect(checkbox).toHaveAttribute("data-state", "unchecked")
    expect(checkbox).toHaveClass("custom-checkbox")

    fireEvent.click(checkbox)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(checkbox).toHaveAttribute("data-state", "checked")
  })

  it("supports indeterminate and disabled states", () => {
    render(
      <>
        <Checkbox aria-label="Select partial" checked="indeterminate" />
        <Checkbox aria-label="Disabled option" disabled />
      </>
    )

    const indeterminate = screen.getByRole("checkbox", {
      name: "Select partial",
    })
    expect(indeterminate).toHaveAttribute("aria-checked", "mixed")
    expect(indeterminate).toHaveAttribute("data-state", "indeterminate")

    const disabled = screen.getByRole("checkbox", { name: "Disabled option" })
    expect(disabled).toBeDisabled()
  })
})

