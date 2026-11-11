import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { SearchX } from "lucide-react"

import { EmptyState } from "@molecules/empty-state"

describe("EmptyState", () => {
  it("renders icon, title, description, and action slot", () => {
    const onClear = vi.fn()

    const { container } = render(
      <EmptyState
        icon={<SearchX data-testid="empty-icon" />}
        title="No members found"
        description='We couldn&apos;t find any members matching "Samantha".'
        action={
          <button type="button" onClick={onClear}>
            Clear search
          </button>
        }
      />
    )

    expect(
      container.querySelector('[data-slot="empty-state"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="empty-state-icon"]')
    ).toHaveAttribute("aria-hidden", "true")
    expect(screen.getByTestId("empty-icon")).toBeInTheDocument()
    expect(screen.getByText("No members found")).toBeInTheDocument()
    expect(
      screen.getByText(/couldn't find any members matching/i)
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Clear search" }))
    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it("omits optional icon, description, and action when not provided", () => {
    const { container } = render(<EmptyState title="Nothing here" />)

    expect(screen.getByText("Nothing here")).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="empty-state-icon"]')
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="empty-state-action"]')
    ).not.toBeInTheDocument()
  })
})

