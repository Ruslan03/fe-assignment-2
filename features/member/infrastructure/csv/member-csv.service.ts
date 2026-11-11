import { toCSV, type LabelKeyObject } from "react-csv/lib/core"

import type { MemberType } from "../../domain/member.entity"
import type { IMemberCsvExporter } from "../../usecase/member-csv-exporter.interface"

export const MEMBER_CSV_HEADERS: LabelKeyObject[] = [
  { label: "ID", key: "id" },
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Role", key: "role" },
  { label: "Department", key: "department" },
  { label: "Employment Type", key: "employmentType" },
  { label: "Bio", key: "bio" },
  { label: "Status", key: "status" },
  { label: "Join Date", key: "joinDate" },
]

export class MemberCsvService implements IMemberCsvExporter {
  exportMembers(members: MemberType[], filename = "members.csv"): void {
    const csvContent = toCSV(members, MEMBER_CSV_HEADERS)

    if (typeof document === "undefined") return

    const hasObjectUrl = typeof URL?.createObjectURL === "function"
    const payload = `\uFEFF${csvContent}`
    const blob = new Blob([payload], {
      type: "text/csv;charset=utf-8;",
    })
    const href = hasObjectUrl
      ? URL.createObjectURL(blob)
      : `data:text/csv;charset=utf-8,${encodeURIComponent(payload)}`

    const link = document.createElement("a")
    link.href = href
    link.download = filename
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    if (hasObjectUrl && typeof URL?.revokeObjectURL === "function") {
      URL.revokeObjectURL(href)
    }
  }
}

