import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { Building2 } from "lucide-react"

import { SelectField } from "@molecules/select-field"

const OPTIONS = [
  { label: "Engineering", value: "eng" },
  { label: "Design", value: "des" },
]

describe("SelectField", () => {
  it("connects label, icon select, required indicator, and errorMessage", () => {
    render(
      <SelectField
        id="department"
        label="Department"
        required
        icon={<Building2 data-testid="dept-icon" />}
        options={OPTIONS}
        placeholder="Choose department"
        errorMessage="Department is required"
      />
    )

    const trigger = screen.getByRole("combobox", { name: "Department" })
    expect(trigger).toHaveAttribute("id", "department")
    expect(trigger).toHaveAttribute("aria-invalid", "true")
    expect(screen.getByTestId("dept-icon")).toBeInTheDocument()
    expect(screen.getByText("*")).toBeInTheDocument()
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Department is required"
    )
  })
})

