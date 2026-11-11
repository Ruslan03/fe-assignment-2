import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { Check } from "lucide-react"

import { FeedbackDialog } from "@molecules/feedback-dialog"

describe("FeedbackDialog", () => {
  it("renders title, rich description, variant icon, children, and footer strip when open", () => {
    const onOpenChange = vi.fn()

    render(
      <FeedbackDialog
        open
        onOpenChange={onOpenChange}
        variant="success"
        showCloseButton
        title="Member Added Successfully"
        description={
          <>
            Profile for <strong>Michael Phelps</strong> updated.
          </>
        }
        icon={<Check data-testid="success-icon" />}
        footer={<button type="button">Back to Dashboard</button>}
      >
        <div>Extra body</div>
      </FeedbackDialog>
    )

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    const iconBox = document.querySelector('[data-slot="feedback-dialog-icon"]')
    expect(iconBox).toHaveAttribute("data-variant", "success")
    expect(iconBox).toHaveClass("bg-sky-100", "rounded-xl")
    expect(screen.getByTestId("success-icon")).toBeInTheDocument()
    expect(screen.getByText("Member Added Successfully")).toBeInTheDocument()
    expect(screen.getByText("Michael Phelps")).toBeInTheDocument()
    expect(screen.getByText("Extra body")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Back to Dashboard" })
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Close" }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("hides close button by default and omits optional slots when not provided", () => {
    render(<FeedbackDialog open onOpenChange={vi.fn()} title="Notice" />)

    expect(screen.getByText("Notice")).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Close" })
    ).not.toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="feedback-dialog-icon"]')
    ).not.toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="dialog-description"]')
    ).not.toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="dialog-footer"]')
    ).not.toBeInTheDocument()
  })
})
