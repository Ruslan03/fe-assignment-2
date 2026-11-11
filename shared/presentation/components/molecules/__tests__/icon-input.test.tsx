import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { Search } from "lucide-react"

import { IconInput } from "@molecules/icon-input"

describe("IconInput", () => {
  it("renders the icon on the left side before the input", () => {
    const { container } = render(
      <IconInput
        icon={<Search data-testid="search-icon" />}
        placeholder="Search members..."
      />
    )

    const wrapper = container.querySelector('[data-slot="icon-input"]')
    const iconSlot = container.querySelector('[data-slot="icon-input-icon"]')
    const input = screen.getByPlaceholderText("Search members...")

    expect(wrapper).toBeInTheDocument()
    expect(iconSlot).toBeInTheDocument()
    expect(iconSlot).toHaveAttribute("aria-hidden", "true")
    expect(screen.getByTestId("search-icon")).toBeInTheDocument()
    expect(input).toHaveClass("pl-9")
    expect(wrapper?.children[0]).toBe(iconSlot)
    expect(wrapper?.children[1]).toBe(input)
  })

  it("forwards input props and change events", () => {
    const handleChange = vi.fn()

    render(
      <IconInput
        icon={<Search />}
        type="search"
        aria-label="Search members"
        defaultValue="Alya"
        onChange={handleChange}
      />
    )

    const input = screen.getByRole("searchbox", { name: "Search members" })
    expect(input).toHaveValue("Alya")

    fireEvent.change(input, { target: { value: "Ruslan" } })
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(input).toHaveValue("Ruslan")
  })

  it("supports disabled state and custom class overrides", () => {
    const { container } = render(
      <IconInput
        icon={<Search />}
        placeholder="Disabled input"
        disabled
        containerClassName="max-w-xs"
        iconClassName="text-primary"
        className="bg-white"
      />
    )

    const wrapper = container.querySelector('[data-slot="icon-input"]')
    const iconSlot = container.querySelector('[data-slot="icon-input-icon"]')
    const input = screen.getByPlaceholderText("Disabled input")

    expect(wrapper).toHaveClass("max-w-xs")
    expect(iconSlot).toHaveClass("opacity-50", "text-primary")
    expect(input).toBeDisabled()
    expect(input).toHaveClass("pl-9", "bg-white")
  })
})

