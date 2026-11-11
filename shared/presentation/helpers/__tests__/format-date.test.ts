import { describe, expect, it } from "vitest"

import { formatDate } from "../format-date"

describe("formatDate", () => {
  it("formats valid ISO date strings in UTC short format", () => {
    expect(formatDate("2025-03-10T09:00:00.000Z")).toBe("Mar 10, 2025")
    expect(formatDate("2026-11-05T00:00:00.000Z")).toBe("Nov 05, 2026")
  })

  it("supports custom Intl date format options in UTC", () => {
    expect(
      formatDate("2022-03-10T09:00:00.000Z", {
        month: "long",
        year: "numeric",
      })
    ).toBe("March 2022")
  })

  it("returns the original value when date is invalid", () => {
    expect(formatDate("TBD")).toBe("TBD")
    expect(formatDate("")).toBe("")
  })
})
