"use client"

import type * as React from "react"
import { useState } from "react"
import { LayoutGrid, Trash2 } from "lucide-react"

import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/presentation/store/hooks"
import { Button } from "@atoms/button"
import { FeedbackDialog } from "@molecules/feedback-dialog"

import { bulkDeleteMembers, selectMemberState } from "../../store"

export interface BulkDeleteMemberButtonProps extends Omit<
  React.ComponentProps<typeof Button>,
  "children" | "onClick" | "type"
> {
  selectedIds: string[]
  onDeleted?: (deletedIds: string[]) => void
}

export function BulkDeleteMemberButton({
  selectedIds,
  onDeleted,
  variant = "destructive",
  disabled,
  ...buttonProps
}: BulkDeleteMemberButtonProps) {
  const dispatch = useAppDispatch()
  const { isBulkDeleting } = useAppSelector(selectMemberState)
  const [deletedCount, setDeletedCount] = useState<number | null>(null)

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return

    const targetIds = [...selectedIds]
    const result = await dispatch(bulkDeleteMembers({ ids: targetIds }))

    if (bulkDeleteMembers.fulfilled.match(result)) {
      setDeletedCount(targetIds.length)
      onDeleted?.(targetIds)
    }
  }

  const handleDismiss = () => {
    setDeletedCount(null)
  }

  if (selectedIds.length === 0 && deletedCount === null) {
    return null
  }

  return (
    <>
      {selectedIds.length > 0 && (
        <Button
          type="button"
          variant={variant}
          disabled={disabled || isBulkDeleting}
          onClick={handleBulkDelete}
          {...buttonProps}
        >
          <Trash2 />
          {isBulkDeleting
            ? "Deleting..."
            : `Delete Selected (${selectedIds.length})`}
        </Button>
      )}

      <FeedbackDialog
        open={deletedCount !== null}
        onOpenChange={(open) => {
          if (!open) handleDismiss()
        }}
        variant="destructive"
        title="Members Deleted Successfully"
        icon={<Trash2 />}
        description={
          deletedCount !== null && (
            <>
              <span className="font-semibold text-foreground">
                {deletedCount} {deletedCount === 1 ? "member" : "members"}
              </span>{" "}
              {deletedCount === 1 ? "has" : "have"} been permanently removed
              from the workspace. All assigned permissions, active sessions, and
              access tokens have been revoked.
            </>
          )
        }
        footer={
          <Button type="button" onClick={handleDismiss}>
            <LayoutGrid />
            Dismiss
          </Button>
        }
      />
    </>
  )
}

