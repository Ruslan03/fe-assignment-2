import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Header } from "@molecules/header"

describe("Header", () => {
  it("renders title, subtitle, and rightContent", () => {
    render(
      <Header
        title="Members Directory"
        subtitle="Manage team members"
        rightContent={<button type="button">Action</button>}
      />
    )

    expect(
      screen.getByRole("heading", { level: 1, name: "Members Directory" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: "Manage team members" })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument()
  })

  it("renders cleanly without optional subtitle and rightContent", () => {
    render(<Header title="Only Title" />)

    expect(
      screen.getByRole("heading", { level: 1, name: "Only Title" })
    ).toBeInTheDocument()
  })
})

