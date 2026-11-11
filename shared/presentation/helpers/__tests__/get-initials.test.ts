import { describe, expect, it } from "vitest"

import { getInitials } from "../get-initials"

describe("getInitials", () => {
  it("extracts uppercase initials up to maxLength (default 2)", () => {
    expect(getInitials("Ruslan Wanandi")).toBe("RW")
    expect(getInitials("  alya   putri  santoso ")).toBe("AP")
    expect(getInitials("Alya Putri Santoso", 3)).toBe("APS")
  })

  it("handles single words and empty strings cleanly", () => {
    expect(getInitials("Ruslan")).toBe("R")
    expect(getInitials("   ")).toBe("")
  })
})

