import { MemberAnalyticsSummary } from "@analytics/presentation/components/ui/member-analytics-summary"
import { Header } from "@molecules/header"
import MainLayout from "@templates/main-layout"

import AddMemberButton from "../ui/add-member-button"
import { MemberList } from "../ui/member-list"

export function DashboardMemberPage() {
  return (
    <MainLayout>
      <Header
        title="Members Directory"
        subtitle="Manage your organization team members, cross-functional roles, and workspace access levels."
        rightContent={
          <div>
            <AddMemberButton />
          </div>
        }
      />
      <MemberAnalyticsSummary />
      <MemberList />
    </MainLayout>
  )
}
