import { Header } from "@molecules/header"
import MainLayout from "@templates/main-layout"

import { MemberForm } from "../ui/member-form"

export function CreateMemberPage() {
  return (
    <MainLayout>
      <Header title="Add New Member" backHref="/" />
      <MemberForm mode="create" />
    </MainLayout>
  )
}
