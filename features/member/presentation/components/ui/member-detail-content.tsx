"use client"

import { useAppSelector } from "@/shared/presentation/store/hooks"
import { Spinner } from "@atoms/spinner"
import { Text } from "@atoms/text"

import { selectMemberState } from "../../store"
import { MemberForm } from "./member-form"
import { MemberProfileCard } from "./member-profile-card"

export interface MemberDetailContentProps {
  memberId?: string
}

export function MemberDetailContent({ memberId }: MemberDetailContentProps) {
  const { selectedMember, isDetailLoading, detailError } =
    useAppSelector(selectMemberState)

  if (!memberId || detailError) {
    return null
  }

  const member =
    selectedMember && selectedMember.id === memberId ? selectedMember : null

  if (isDetailLoading || !member) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12">
        <Spinner size="lg" label="Loading member details..." />
        <Text variant="muted" className="text-xs font-medium">
          Loading member details...
        </Text>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 pb-10 lg:grid-cols-[320px_1fr]">
      <MemberProfileCard member={member} />
      <MemberForm mode="edit" initialData={member} />
    </div>
  )
}

