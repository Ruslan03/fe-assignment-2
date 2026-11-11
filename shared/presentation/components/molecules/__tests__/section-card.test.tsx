import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { SectionCard } from "@molecules/section-card"

describe("SectionCard", () => {
  it("renders title, subtitle, headerAction, children, and footer when provided", () => {
    render(
      <SectionCard
        title="General Information"
        subtitle="Add personal records."
        headerAction={<button type="button">Reset</button>}
        footer={<button type="submit">Save</button>}
      >
        <div>Body Content</div>
      </SectionCard>
    )

    expect(screen.getByText("General Information")).toBeInTheDocument()
    expect(screen.getByText("Add personal records.")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument()
    expect(screen.getByText("Body Content")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
  })

  it("omits optional subtitle, headerAction, and footer when not provided", () => {
    const { container } = render(
      <SectionCard title="Basic Section">
        <div>Only Body</div>
      </SectionCard>
    )

    expect(screen.getByText("Basic Section")).toBeInTheDocument()
    expect(screen.getByText("Only Body")).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="card-description"]')
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="card-action"]')
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="card-footer"]')
    ).not.toBeInTheDocument()
  })
})

