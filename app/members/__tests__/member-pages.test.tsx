import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import MemberDetailPage from "../[id]/page"
import NewMemberPage from "../new/page"

describe("Member route pages", () => {
  it("renders member detail page", async () => {
    render(await MemberDetailPage())
    expect(screen.getByText("Member View Page")).toBeInTheDocument()
  })

  it("renders create member page", async () => {
    render(await NewMemberPage())
    expect(screen.getByText("Create Member Page")).toBeInTheDocument()
  })
})

