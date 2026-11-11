import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import AddMemberButton from "../add-member-button"

describe("AddMemberButton", () => {
  it("renders a link button pointing to /members/new", () => {
    render(<AddMemberButton />)

    const link = screen.getByRole("link", { name: "Add Member" })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/members/new")
    expect(link).toHaveAttribute("data-slot", "button")
  })
})

