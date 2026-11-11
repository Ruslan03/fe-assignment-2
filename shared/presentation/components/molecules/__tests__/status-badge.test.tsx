import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { StatusBadge } from "@molecules/status-badge"

describe("StatusBadge", () => {
  it("renders Badge combined with Dot using default variant", () => {
    const { container } = render(<StatusBadge>Pending</StatusBadge>)

    const badge = screen.getByText("Pending")
    const dot = container.querySelector('[data-slot="dot"]')

    expect(badge).toBeInTheDocument()
    expect(badge).toHaveAttribute("data-slot", "status-badge")
    expect(badge).toHaveAttribute("data-variant", "default")
    expect(badge).toHaveClass("bg-primary/10", "text-primary")
    expect(dot).toBeInTheDocument()
    expect(dot).toHaveAttribute("data-variant", "default")
    expect(dot).toHaveAttribute("data-size", "sm")
  })

  it("supports semantic variants, dotSize, and custom class overrides", () => {
    const { container } = render(
      <>
        <StatusBadge variant="success" dotSize="md" className="custom-pill">
          Active
        </StatusBadge>
        <StatusBadge variant="warning" dotClassName="opacity-50">
          Inactive
        </StatusBadge>
      </>
    )

    const activeBadge = screen.getByText("Active")
    const inactiveBadge = screen.getByText("Inactive")
    const dots = container.querySelectorAll('[data-slot="dot"]')

    expect(activeBadge).toHaveAttribute("data-variant", "success")
    expect(activeBadge).toHaveClass(
      "bg-status-success",
      "text-status-success-foreground",
      "custom-pill"
    )
    expect(dots[0]).toHaveAttribute("data-variant", "success")
    expect(dots[0]).toHaveAttribute("data-size", "md")

    expect(inactiveBadge).toHaveAttribute("data-variant", "warning")
    expect(inactiveBadge).toHaveClass(
      "bg-status-warning",
      "text-status-warning-foreground"
    )
    expect(dots[1]).toHaveAttribute("data-variant", "warning")
    expect(dots[1]).toHaveClass("opacity-50")
  })
})

