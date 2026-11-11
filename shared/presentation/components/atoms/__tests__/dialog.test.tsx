import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@atoms/dialog"

describe("Dialog atoms", () => {
  it("opens dialog content and renders header, description, and footer", () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>Are you sure?</DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton>
            <button type="button">Confirm</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Open Dialog" }))

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Confirm Action")).toHaveAttribute(
      "data-slot",
      "dialog-title"
    )
    expect(screen.getByText("Are you sure?")).toHaveAttribute(
      "data-slot",
      "dialog-description"
    )
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument()
  })
})

