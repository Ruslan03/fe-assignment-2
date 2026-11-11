import type { MemberType } from "../domain/member.entity"

export interface IMemberCsvExporter {
  exportMembers: (members: MemberType[], filename?: string) => void
}

