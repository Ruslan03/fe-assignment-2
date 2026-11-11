import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@atoms/select"

describe("Select atoms", () => {
  it("renders SelectTrigger and displays selected value", () => {
    render(
      <Select defaultValue="eng">
        <SelectTrigger aria-label="Department" size="sm">
          <SelectValue placeholder="Choose..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Teams</SelectLabel>
            <SelectItem value="eng">Engineering</SelectItem>
            <SelectSeparator />
            <SelectItem value="des">Design</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox", { name: "Department" })
    expect(trigger).toHaveAttribute("data-slot", "select-trigger")
    expect(trigger).toHaveAttribute("data-size", "sm")
    expect(trigger).toHaveTextContent("Engineering")
  })
})

