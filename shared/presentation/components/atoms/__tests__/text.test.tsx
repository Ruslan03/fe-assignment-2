import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { Text } from "@atoms/text"

describe("Text", () => {
  it("renders as a paragraph by default with p variant", () => {
    render(<Text>Hello world</Text>)

    const element = screen.getByText("Hello world")
    expect(element).toBeInTheDocument()
    expect(element.tagName).toBe("P")
    expect(element).toHaveAttribute("data-slot", "text")
    expect(element).toHaveAttribute("data-variant", "p")
    expect(element).toHaveClass("text-base", "leading-7")
  })

  it("maps semantic variants to corresponding HTML tags", () => {
    render(
      <>
        <Text variant="h1">Heading 1</Text>
        <Text variant="h2">Heading 2</Text>
        <Text variant="caption">Caption text</Text>
        <Text variant="code">const x = 1</Text>
        <Text variant="blockquote">Quote text</Text>
      </>
    )

    expect(screen.getByText("Heading 1").tagName).toBe("H1")
    expect(screen.getByText("Heading 1")).toHaveClass("text-4xl", "font-extrabold")
    expect(screen.getByText("Heading 2").tagName).toBe("H2")
    expect(screen.getByText("Caption text").tagName).toBe("SPAN")
    expect(screen.getByText("const x = 1").tagName).toBe("CODE")
    expect(screen.getByText("Quote text").tagName).toBe("BLOCKQUOTE")
  })

  it("overrides rendered element via the as prop", () => {
    render(
      <Text variant="h3" as="span">
        Inline heading style
      </Text>
    )

    const element = screen.getByText("Inline heading style")
    expect(element.tagName).toBe("SPAN")
    expect(element).toHaveClass("text-2xl", "font-semibold")
  })

  it("supports Slot composition via asChild", () => {
    render(
      <Text variant="small" asChild>
        <a href="/posts">Read posts</a>
      </Text>
    )

    const link = screen.getByRole("link", { name: "Read posts" })
    expect(link).toHaveAttribute("href", "/posts")
    expect(link).toHaveClass("text-sm", "font-medium")
    expect(link).toHaveAttribute("data-slot", "text")
  })

  it("applies weight, align, and custom className overrides", () => {
    render(
      <Text variant="muted" weight="bold" align="center" className="text-primary">
        Styled text
      </Text>
    )

    const element = screen.getByText("Styled text")
    expect(element).toHaveClass("font-bold", "text-center", "text-primary")
    expect(element).not.toHaveClass("text-muted-foreground")
  })
})

