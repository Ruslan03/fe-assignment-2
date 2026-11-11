const DEFAULT_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  timeZone: "UTC",
})

/** Formats a date string into a readable short date (UTC), falling back to the raw value if invalid. */
export function formatDate(value: string): string {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return DEFAULT_DATE_FORMATTER.format(parsed)
}

