import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("@user/presentation/components/user-info", () => ({
  default: () => <div data-testid="mock-user-info">User Info</div>,
}))

import MainLayout from "@templates/main-layout"

describe("MainLayout", () => {
  it("renders MainNavbar and main content children", () => {
    render(
      <MainLayout>
        <p>Page Content</p>
      </MainLayout>
    )

    expect(screen.getByTestId("mock-user-info")).toBeInTheDocument()
    expect(screen.getByRole("main")).toBeInTheDocument()
    expect(screen.getByText("Page Content")).toBeInTheDocument()
  })
})

