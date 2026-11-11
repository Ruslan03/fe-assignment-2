import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Dot } from "@atoms/dot"

describe("Dot", () => {
  it("renders with default variant and sm size", () => {
    const { container } = render(<Dot />)

    const dot = container.querySelector('[data-slot="dot"]')
    expect(dot).toBeInTheDocument()
    expect(dot?.tagName).toBe("SPAN")
    expect(dot).toHaveAttribute("aria-hidden", "true")
    expect(dot).toHaveAttribute("data-variant", "default")
    expect(dot).toHaveAttribute("data-size", "sm")
    expect(dot).toHaveClass("size-1.5", "rounded-full", "bg-primary")
  })

  it("supports semantic variants, sizes, and custom className overrides", () => {
    const { container } = render(
      <>
        <Dot variant="success" size="md" />
        <Dot variant="muted" size="lg" className="opacity-75" />
      </>
    )

    const dots = container.querySelectorAll('[data-slot="dot"]')
    expect(dots).toHaveLength(2)

    expect(dots[0]).toHaveAttribute("data-variant", "success")
    expect(dots[0]).toHaveAttribute("data-size", "md")
    expect(dots[0]).toHaveClass("size-2", "bg-emerald-500")

    expect(dots[1]).toHaveAttribute("data-variant", "muted")
    expect(dots[1]).toHaveAttribute("data-size", "lg")
    expect(dots[1]).toHaveClass("size-2.5", "bg-muted-foreground", "opacity-75")
  })
})

