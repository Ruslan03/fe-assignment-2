import { Header } from "@molecules/header"
import MainLayout from "@templates/main-layout"

import { CreateMemberForm } from "../ui/create-member-form"

export function CreateMemberPage() {
  return (
    <MainLayout>
      <Header title="Add New Member" backHref="/" />
      <CreateMemberForm />
    </MainLayout>
  )
}
