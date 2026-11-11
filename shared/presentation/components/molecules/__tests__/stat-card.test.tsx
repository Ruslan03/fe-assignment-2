import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { Users } from "lucide-react"

import { StatCard } from "@molecules/stat-card"

describe("StatCard", () => {
  it("renders label, value, icon, and trend badge with semantic variant", () => {
    const { container } = render(
      <StatCard
        label="Total Members"
        value={148}
        badge="+12 this month"
        icon={<Users data-testid="stat-icon" />}
        variant="info"
      />
    )

    expect(screen.getByText("Total Members")).toBeInTheDocument()
    expect(screen.getByText("148")).toBeInTheDocument()
    expect(screen.getByTestId("stat-icon")).toBeInTheDocument()

    const iconBox = container.querySelector('[data-slot="stat-card-icon"]')
    const badge = container.querySelector('[data-slot="stat-card-badge"]')

    expect(iconBox).toHaveAttribute("data-variant", "info")
    expect(badge).toHaveAttribute("data-variant", "info")
    expect(badge).toHaveTextContent("+12 this month")
  })

  it("omits optional icon and badge when not provided", () => {
    const { container } = render(<StatCard label="Departments" value={8} />)

    expect(screen.getByText("Departments")).toBeInTheDocument()
    expect(screen.getByText("8")).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="stat-card-icon"]')
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="stat-card-badge"]')
    ).not.toBeInTheDocument()
  })
})

