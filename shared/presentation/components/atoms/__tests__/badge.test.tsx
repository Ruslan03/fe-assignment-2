import Link from "next/link"
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Badge } from "@atoms/badge"

describe("Badge", () => {
  it("renders with default variant and data-slot", () => {
    render(<Badge>Engineering</Badge>)

    const badge = screen.getByText("Engineering")
    expect(badge).toBeInTheDocument()
    expect(badge.tagName).toBe("SPAN")
    expect(badge).toHaveAttribute("data-slot", "badge")
    expect(badge).toHaveAttribute("data-variant", "default")
  })

  it("supports variants, custom className, and asChild composition", () => {
    render(
      <>
        <Badge variant="secondary" className="custom-badge">
          Active
        </Badge>
        <Badge variant="outline" asChild>
          <Link href="/members">Directory</Link>
        </Badge>
      </>
    )

    const secondaryBadge = screen.getByText("Active")
    expect(secondaryBadge).toHaveAttribute("data-variant", "secondary")
    expect(secondaryBadge).toHaveClass("custom-badge")

    const linkBadge = screen.getByRole("link", { name: "Directory" })
    expect(linkBadge).toHaveAttribute("data-slot", "badge")
    expect(linkBadge).toHaveAttribute("data-variant", "outline")
    expect(linkBadge).toHaveAttribute("href", "/members")
  })
})
