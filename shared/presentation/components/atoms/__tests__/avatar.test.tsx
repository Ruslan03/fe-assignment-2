import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Avatar } from "@atoms/avatar"

describe("Avatar", () => {
  it("renders default circle avatar with initials", () => {
    render(<Avatar>SJ</Avatar>)

    const avatar = screen.getByText("SJ")
    expect(avatar).toHaveAttribute("data-slot", "avatar")
    expect(avatar).toHaveAttribute("data-variant", "default")
    expect(avatar).toHaveAttribute("data-shape", "circle")
    expect(avatar).toHaveAttribute("data-size", "md")
    expect(avatar).toHaveClass("rounded-full", "bg-primary", "size-9")
  })

  it("supports soft/rounded/xl variant combinations", () => {
    render(
      <>
        <Avatar variant="soft" size="sm">
          RW
        </Avatar>
        <Avatar shape="rounded" size="xl" className="custom-avatar">
          SJ
        </Avatar>
      </>
    )

    const smallAvatar = screen.getByText("RW")
    expect(smallAvatar).toHaveAttribute("data-variant", "soft")
    expect(smallAvatar).toHaveClass("bg-primary/10", "size-8")

    const xlAvatar = screen.getByText("SJ")
    expect(xlAvatar).toHaveAttribute("data-shape", "rounded")
    expect(xlAvatar).toHaveAttribute("data-size", "xl")
    expect(xlAvatar).toHaveClass("rounded-2xl", "size-20", "custom-avatar")
  })
})

