"use client"

import type * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { LayoutGrid, Trash2 } from "lucide-react"

import { useAppDispatch, useAppSelector } from "@/shared/presentation/store/hooks"
import { Button } from "@atoms/button"
import { FeedbackDialog } from "@molecules/feedback-dialog"

import type { MemberType } from "../../../domain/member.entity"
import {
  deleteMember,
  removeMemberFromState,
  selectMemberState,
} from "../../store"

export interface DeleteMemberButtonProps extends Omit<
  React.ComponentProps<typeof Button>,
  "children" | "onClick" | "type"
> {
  member: Pick<MemberType, "id" | "name">
  label?: string
  iconOnly?: boolean
  dismissHref?: string
  onDeleted?: (member: MemberType) => void
}

export function DeleteMemberButton({
  member,
  label = "Delete Member",
  iconOnly = false,
  dismissHref,
  onDeleted,
  variant = "destructive",
  disabled,
  "aria-label": ariaLabel,
  ...buttonProps
}: DeleteMemberButtonProps) {
  const dispatch = useAppDispatch()
  const { isDeleting } = useAppSelector(selectMemberState)
  const [deletedMember, setDeletedMember] = useState<MemberType | null>(null)

  const handleDelete = async () => {
    const result = await dispatch(deleteMember(member.id))
    if (deleteMember.fulfilled.match(result)) {
      setDeletedMember(result.payload)
    }
  }

  const handleDismiss = () => {
    if (!deletedMember) return
    const confirmedMember = deletedMember
    setDeletedMember(null)
    dispatch(removeMemberFromState(confirmedMember.id))
    onDeleted?.(confirmedMember)
  }

  return (
    <>
      <Button
        type="button"
        variant={variant}
        disabled={disabled || isDeleting}
        aria-label={ariaLabel ?? (iconOnly ? `Delete ${member.name}` : undefined)}
        onClick={handleDelete}
        {...buttonProps}
      >
        <Trash2 />
        {!iconOnly && label}
      </Button>

      <FeedbackDialog
        open={Boolean(deletedMember)}
        onOpenChange={(open) => {
          if (!open) handleDismiss()
        }}
        variant="destructive"
        title="Member Deleted Successfully"
        icon={<Trash2 />}
        description={
          deletedMember && (
            <>
              <span className="font-semibold text-foreground">
                {deletedMember.name}
              </span>{" "}
              (
              <span className="font-mono text-primary">
                #{deletedMember.id.toUpperCase()}
              </span>
              ) has been permanently removed from the workspace. All assigned
              permissions, active sessions, and access tokens have been revoked.
            </>
          )
        }
        footer={
          dismissHref ? (
            <Button asChild>
              <Link href={dismissHref} onClick={handleDismiss}>
                <LayoutGrid />
                Dismiss
              </Link>
            </Button>
          ) : (
            <Button type="button" onClick={handleDismiss}>
              <LayoutGrid />
              Dismiss
            </Button>
          )
        }
      />
    </>
  )
}

