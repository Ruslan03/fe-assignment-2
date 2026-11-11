import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@atoms/table"

describe("Table atoms", () => {
  it("renders all table parts with expected semantic elements and data-slots", () => {
    const { container } = render(
      <Table className="custom-table">
        <TableCaption className="custom-caption">Team summary</TableCaption>
        <TableHeader className="custom-header">
          <TableRow className="custom-row">
            <TableHead className="custom-head">Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="custom-body">
          <TableRow>
            <TableCell className="custom-cell">Ruslan</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter className="custom-footer">
          <TableRow>
            <TableCell>Total: 1</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )

    expect(
      container.querySelector('[data-slot="table-container"]')
    ).toBeInTheDocument()
    expect(container.querySelector('[data-slot="table"]')).toHaveClass(
      "custom-table"
    )
    expect(screen.getByText("Team summary")).toHaveAttribute(
      "data-slot",
      "table-caption"
    )
    expect(screen.getByText("Team summary")).toHaveClass("custom-caption")
    expect(container.querySelector('[data-slot="table-header"]')).toHaveClass(
      "custom-header"
    )
    expect(container.querySelector('[data-slot="table-row"]')).toHaveClass(
      "custom-row"
    )
    expect(screen.getByText("Name")).toHaveAttribute("data-slot", "table-head")
    expect(screen.getByText("Name")).toHaveClass("custom-head")
    expect(container.querySelector('[data-slot="table-body"]')).toHaveClass(
      "custom-body"
    )
    expect(screen.getByText("Ruslan")).toHaveAttribute(
      "data-slot",
      "table-cell"
    )
    expect(screen.getByText("Ruslan")).toHaveClass("custom-cell")
    expect(container.querySelector('[data-slot="table-footer"]')).toHaveClass(
      "custom-footer"
    )
    expect(screen.getByText("Total: 1")).toBeInTheDocument()
  })
})

