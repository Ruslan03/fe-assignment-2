import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { Building2 } from "lucide-react"

import { IconSelect } from "@molecules/icon-select"

const OPTIONS = [
  { label: "Engineering", value: "eng" },
  { label: "Design", value: "des" },
]

describe("IconSelect", () => {
  it("renders leading icon and selected value", () => {
    const { container } = render(
      <IconSelect
        icon={<Building2 data-testid="dept-icon" />}
        options={OPTIONS}
        defaultValue="des"
        ariaLabel="Department"
      />
    )

    const iconSlot = container.querySelector('[data-slot="icon-select-icon"]')
    const trigger = screen.getByRole("combobox", { name: "Department" })

    expect(iconSlot).toBeInTheDocument()
    expect(screen.getByTestId("dept-icon")).toBeInTheDocument()
    expect(trigger).toHaveClass("w-full", "pl-9")
    expect(trigger).toHaveTextContent("Design")
  })

  it("renders placeholder without icon slot when icon is omitted and supports disabled", () => {
    const { container } = render(
      <IconSelect
        options={OPTIONS}
        placeholder="Select department"
        ariaLabel="Department"
        disabled
      />
    )

    expect(
      container.querySelector('[data-slot="icon-select-icon"]')
    ).not.toBeInTheDocument()

    const trigger = screen.getByRole("combobox", { name: "Department" })
    expect(trigger).toBeDisabled()
    expect(trigger).not.toHaveClass("pl-9")
    expect(trigger).toHaveTextContent("Select department")
  })
})

