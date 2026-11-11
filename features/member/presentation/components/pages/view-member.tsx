import MainLayout from "@templates/main-layout"

import { MemberDetailContent } from "../ui/member-detail-content"
import { MemberDetailHeader } from "../ui/member-detail-header"

export interface ViewMemberPageProps {
  memberId?: string
}

export function ViewMemberPage({ memberId }: ViewMemberPageProps) {
  return (
    <MainLayout>
      <MemberDetailHeader memberId={memberId} />
      <MemberDetailContent memberId={memberId} />
    </MainLayout>
  )
}
