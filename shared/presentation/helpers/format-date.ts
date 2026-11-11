const DEFAULT_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  timeZone: "UTC",
})

/** Formats a date string into a readable date (UTC), falling back to the raw value if invalid. */
export function formatDate(
  value: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  if (!options) return DEFAULT_DATE_FORMATTER.format(parsed)

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    ...options,
  }).format(parsed)
}
