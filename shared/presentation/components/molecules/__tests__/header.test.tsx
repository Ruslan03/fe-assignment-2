import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { Header } from "@molecules/header"

describe("Header", () => {
  it("renders title, subtitle, rightContent, and back link when provided", () => {
    render(
      <Header
        title="Members Directory"
        subtitle="Manage team members"
        backHref="/"
        rightContent={<button type="button">Action</button>}
      />
    )

    expect(screen.getByRole("link", { name: "Go back" })).toHaveAttribute(
      "href",
      "/"
    )
    expect(
      screen.getByRole("heading", { level: 1, name: "Members Directory" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: "Manage team members" })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument()
  })

  it("supports ReactNode title and subtitle content", () => {
    render(
      <Header
        title={
          <>
            <span>Sarah Jenkins</span>
            <span>Active</span>
          </>
        }
        subtitle={
          <>
            <span>ID: #MEM-2048</span>
            <span>Joined March 2022</span>
          </>
        }
      />
    )

    expect(
      screen.getByRole("heading", { level: 1, name: /Sarah Jenkins/i })
    ).toBeInTheDocument()
    expect(screen.getByText("Active")).toBeInTheDocument()
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument()
    expect(screen.getByText("ID: #MEM-2048")).toBeInTheDocument()
    expect(screen.getByText("Joined March 2022")).toBeInTheDocument()
  })

  it("supports onBack callback button", () => {
    const onBack = vi.fn()

    render(<Header title="Edit Member" onBack={onBack} backLabel="Back" />)

    const backButton = screen.getByRole("button", { name: "Back" })
    fireEvent.click(backButton)
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it("does not render optional subtitle, back button, or rightContent when omitted", () => {
    const { container } = render(<Header title="Only Title" />)

    expect(
      screen.getByRole("heading", { level: 1, name: "Only Title" })
    ).toBeInTheDocument()
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument()
    expect(screen.queryByRole("link")).not.toBeInTheDocument()
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
    expect(container.firstElementChild?.children).toHaveLength(1)
  })
})
