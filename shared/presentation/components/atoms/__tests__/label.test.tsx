import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Label } from "@atoms/label"

describe("Label", () => {
  it("renders with data-slot and htmlFor attribute", () => {
    render(<Label htmlFor="full-name">Full Name</Label>)

    const label = screen.getByText("Full Name")
    expect(label).toHaveAttribute("data-slot", "label")
    expect(label).toHaveAttribute("for", "full-name")
  })
})

