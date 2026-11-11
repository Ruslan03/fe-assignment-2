import { ViewMemberPage } from "@member/presentation/components/pages/view-member"

interface MemberDetailRouteProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: MemberDetailRouteProps) {
  const { id } = await params

  return <ViewMemberPage memberId={id} />
}
