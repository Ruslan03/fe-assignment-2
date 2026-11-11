import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@atoms/card"

describe("Card atoms", () => {
  it("renders all card slots with expected attributes", () => {
    const { container } = render(
      <Card size="sm" className="custom-card">
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Subtitle</CardDescription>
          <CardAction>
            <button type="button">Edit</button>
          </CardAction>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    )

    const card = container.querySelector('[data-slot="card"]')
    expect(card).toHaveAttribute("data-size", "sm")
    expect(card).toHaveClass("custom-card")
    expect(screen.getByText("Title")).toHaveAttribute("data-slot", "card-title")
    expect(screen.getByText("Subtitle")).toHaveAttribute(
      "data-slot",
      "card-description"
    )
    expect(screen.getByRole("button", { name: "Edit" }).parentElement).toHaveAttribute(
      "data-slot",
      "card-action"
    )
    expect(screen.getByText("Body")).toHaveAttribute(
      "data-slot",
      "card-content"
    )
    expect(screen.getByText("Footer")).toHaveAttribute(
      "data-slot",
      "card-footer"
    )
  })
})

