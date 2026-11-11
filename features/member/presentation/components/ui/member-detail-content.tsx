"use client"

import { useAppSelector } from "@/shared/presentation/store/hooks"

import { selectMemberState } from "../../store"
import { MemberForm } from "./member-form"
import { MemberProfileCard } from "./member-profile-card"

export interface MemberDetailContentProps {
  memberId?: string
}

export function MemberDetailContent({ memberId }: MemberDetailContentProps) {
  const { selectedMember, isDetailLoading, detailError } =
    useAppSelector(selectMemberState)

  const member =
    memberId && selectedMember && selectedMember.id === memberId
      ? selectedMember
      : null

  if (!memberId || isDetailLoading || detailError || !member) {
    return null
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 pb-10 lg:grid-cols-[320px_1fr]">
      <MemberProfileCard member={member} />
      <MemberForm mode="edit" initialData={member} />
    </div>
  )
}

