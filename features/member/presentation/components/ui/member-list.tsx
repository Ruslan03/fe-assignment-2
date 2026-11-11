"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { SearchX } from "lucide-react"

import { formatDate } from "@/shared/presentation/helpers/format-date"
import { getInitials } from "@/shared/presentation/helpers/get-initials"
import { useDebounce } from "@/shared/presentation/hooks/use-debounce"
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/presentation/store/hooks"
import { Avatar } from "@atoms/avatar"
import { Badge } from "@atoms/badge"
import { Button } from "@atoms/button"
import { Text } from "@atoms/text"
import { EmptyState } from "@molecules/empty-state"
import { StatusBadge } from "@molecules/status-badge"
import { DataTable, type DataTableColumn } from "@organisms/data-table"

import type { MemberType } from "../../../domain/member.entity"
import {
  clearBulkDeleteError,
  clearDeleteError,
  fetchMembers,
  selectMemberState,
  setSearch,
} from "../../store"
import { BulkDeleteMemberButton } from "./bulk-delete-member-button"
import { DeleteMemberButton } from "./delete-member-button"

function getMemberDetailHref(id: string): string {
  return `/members/${encodeURIComponent(id)}`
}

const MEMBER_AVATAR_VARIANTS = [
  "soft-primary",
  "soft-info",
  "soft-muted",
  "soft-warning",
] as const

function getMemberColumns(
  actionsDisabled: boolean
): DataTableColumn<MemberType>[] {
  return [
    {
      key: "member",
      header: "MEMBER",
      render: (member, index) => (
        <Link
          href={getMemberDetailHref(member.id)}
          className="group flex w-fit items-center gap-3 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Avatar
            variant={
              MEMBER_AVATAR_VARIANTS[index % MEMBER_AVATAR_VARIANTS.length]
            }
            shape="rounded"
            size="md"
            aria-hidden="true"
          >
            {getInitials(member.name)}
          </Avatar>
          <div className="flex flex-col">
            <Text
              variant="small"
              className="text-sm leading-5 font-semibold text-foreground transition-colors group-hover:text-primary"
            >
              {member.name}
            </Text>
            <Text variant="caption" className="leading-4">
              {member.email}
            </Text>
          </div>
        </Link>
      ),
    },
    {
      key: "role",
      header: "ROLE / TITLE",
      accessor: "role",
      cellClassName: "text-xs font-medium text-foreground",
    },
    {
      key: "department",
      header: "DEPARTMENT",
      render: (member) => (
        <Badge
          variant="secondary"
          className="rounded-md bg-surface-subtle px-2 py-0.5 text-[11px] font-medium text-foreground"
        >
          {member.department}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "STATUS",
      render: (member) => {
        const isActive = member.status === "active"

        return (
          <StatusBadge variant={isActive ? "success" : "warning"}>
            {isActive ? "Active" : "Inactive"}
          </StatusBadge>
        )
      },
    },
    {
      key: "joinDate",
      header: "JOINED DATE",
      cellClassName: "font-mono text-xs text-muted-foreground",
      render: (member) => formatDate(member.joinDate),
    },
    {
      key: "actions",
      header: "ACTIONS",
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: (member) => (
        <div className="inline-flex items-center justify-end gap-1">
          {actionsDisabled ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled
              className="text-primary"
            >
              Edit
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-primary hover:bg-primary/10 hover:text-primary"
            >
              <Link href={getMemberDetailHref(member.id)}>Edit</Link>
            </Button>
          )}
          <DeleteMemberButton
            member={member}
            variant="ghost"
            size="icon-sm"
            iconOnly
            disabled={actionsDisabled}
            aria-label={`Delete ${member.name}`}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          />
        </div>
      ),
    },
  ]
}

export function MemberList() {
  const dispatch = useAppDispatch()
  const {
    items,
    search,
    isLoading,
    error,
    deleteError,
    bulkDeleteError,
    isBulkDeleting,
  } = useAppSelector(selectMemberState)
  const debouncedSearch = useDebounce(search, 500, {
    immediateWhen: (value) => value === "",
  })
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const validSelectedIds = useMemo(() => {
    const visibleIds = new Set(items.map((member) => member.id))
    return selectedIds.filter((id) => visibleIds.has(id))
  }, [items, selectedIds])

  const actionsDisabled = validSelectedIds.length > 0 || isBulkDeleting
  const actionError = bulkDeleteError ?? deleteError
  const emptySearchQuery = search.trim()
    ? debouncedSearch.trim() || search.trim()
    : ""

  const handleSearchChange = (value: string) => {
    setSelectedIds([])
    dispatch(setSearch(value))
  }

  const handleClearSearch = () => {
    handleSearchChange("")
  }

  const columns = useMemo(
    () => getMemberColumns(actionsDisabled),
    [actionsDisabled]
  )

  useEffect(() => {
    void dispatch(fetchMembers(debouncedSearch || undefined))
  }, [dispatch, debouncedSearch])

  useEffect(() => {
    return () => {
      dispatch(clearDeleteError())
      dispatch(clearBulkDeleteError())
    }
  }, [dispatch])

  return (
    <>
      {actionError && (
        <Text
          as="p"
          variant="caption"
          role="alert"
          className="text-destructive"
        >
          {actionError}
        </Text>
      )}
      <DataTable
        columns={columns}
        data={items}
        getRowKey={(member) => member.id}
        isLoading={isLoading}
        error={error}
        loadingMessage="Loading members..."
        emptyState={
          <EmptyState
            icon={<SearchX />}
            title="No members found"
            description={
              emptySearchQuery
                ? `We couldn't find any members matching "${emptySearchQuery}". Try checking for typos or searching with different keywords.`
                : "There are no members in the directory yet. Add a member to get started."
            }
            action={
              emptySearchQuery ? (
                <Button type="button" onClick={handleClearSearch}>
                  Clear search
                </Button>
              ) : undefined
            }
          />
        }
        search={{
          value: search,
          onChange: handleSearchChange,
          onClear: handleClearSearch,
          clearLabel: "Clear search input",
          placeholder: "Search by name, email, or role...",
          ariaLabel: "Search members",
        }}
        toolbar={
          <BulkDeleteMemberButton
            selectedIds={validSelectedIds}
            onDeleted={() => setSelectedIds([])}
          />
        }
        selection={{
          selectedKeys: validSelectedIds,
          onChange: (keys) => setSelectedIds(keys.map(String)),
          selectAllLabel: "Select all members",
          getRowLabel: (member) => `Select ${member.name}`,
        }}
      />
    </>
  )
}
