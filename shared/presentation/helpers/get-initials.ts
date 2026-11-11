/** Extracts uppercase initials from a full name, capped at `maxLength` characters. */
export function getInitials(name: string, maxLength = 2): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, maxLength)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

