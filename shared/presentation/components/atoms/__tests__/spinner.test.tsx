import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Spinner } from "@atoms/spinner"

describe("Spinner", () => {
  it("renders accessible status spinner with default md size", () => {
    const { container } = render(<Spinner />)

    const spinner = screen.getByRole("status", { name: "Loading" })
    const svg = container.querySelector("svg")

    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveAttribute("data-slot", "spinner")
    expect(spinner).toHaveAttribute("data-size", "md")
    expect(spinner).toHaveClass("text-primary")
    expect(svg).toHaveAttribute("aria-hidden", "true")
    expect(svg).toHaveClass("animate-spin", "size-6")
  })

  it("supports custom label, size variants, and className overrides", () => {
    const { container } = render(
      <Spinner size="lg" label="Loading member details..." className="text-foreground" />
    )

    const spinner = screen.getByRole("status", {
      name: "Loading member details...",
    })
    const svg = container.querySelector("svg")

    expect(spinner).toHaveAttribute("data-size", "lg")
    expect(spinner).toHaveClass("text-foreground")
    expect(svg).toHaveClass("size-8")
  })
})

