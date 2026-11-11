"use client"

import { useEffect } from "react"
import { Calendar } from "lucide-react"

import { formatDate } from "@/shared/presentation/helpers/format-date"
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/presentation/store/hooks"
import { Badge } from "@atoms/badge"
import { Dot } from "@atoms/dot"
import { Text } from "@atoms/text"
import { CopyButton } from "@molecules/copy-button"
import { Header } from "@molecules/header"
import { StatusBadge } from "@molecules/status-badge"

import { fetchMemberById, selectMemberState } from "../../store"

export interface MemberDetailHeaderProps {
  memberId?: string
}

export function MemberDetailHeader({ memberId }: MemberDetailHeaderProps) {
  const dispatch = useAppDispatch()
  const { selectedMember, isDetailLoading, detailError } =
    useAppSelector(selectMemberState)

  useEffect(() => {
    if (!memberId) return
    void dispatch(fetchMemberById(memberId))
  }, [dispatch, memberId])

  if (!memberId) {
    return <Header title="Member Detail" backHref="/" />
  }

  if (detailError) {
    return (
      <Header
        title="Member Detail"
        subtitle={
          <Text variant="muted" className="text-destructive">
            {detailError}
          </Text>
        }
        backHref="/"
      />
    )
  }

  const member =
    selectedMember && selectedMember.id === memberId ? selectedMember : null

  if (isDetailLoading || !member) {
    return (
      <Header
        title="Member Detail"
        subtitle={
          isDetailLoading
            ? "Loading member details..."
            : `ID: #${memberId.toUpperCase()}`
        }
        backHref="/"
      />
    )
  }

  const isActive = member.status === "active"
  const formattedId = `#${member.id.toUpperCase()}`
  const joinedDate = formatDate(member.joinDate, {
    month: "long",
    year: "numeric",
  })

  return (
    <Header
      backHref="/"
      title={
        <>
          <span>{member.name}</span>
          <StatusBadge
            variant={isActive ? "success" : "muted"}
            className="tracking-normal"
          >
            {isActive ? "Active" : "Inactive"}
          </StatusBadge>
        </>
      }
      subtitle={
        <>
          <Badge
            variant="secondary"
            className="rounded-md font-mono font-normal text-muted-foreground"
          >
            ID: {formattedId}
          </Badge>
          {joinedDate && (
            <>
              <Dot variant="muted" size="xs" />
              <span className="inline-flex items-center gap-1.5 text-xs">
                <Calendar className="size-3.5" aria-hidden="true" />
                <span>Joined {joinedDate}</span>
              </span>
            </>
          )}
        </>
      }
      rightContent={
        <CopyButton value={member.id} label="Copy ID" copiedLabel="Copied!" />
      }
    />
  )
}
