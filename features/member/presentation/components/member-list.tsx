'use client'

import { useEffect } from "react"
import { Trash2 } from "lucide-react"

import { formatDate } from "@/shared/presentation/helpers/format-date"
import { getInitials } from "@/shared/presentation/helpers/get-initials"
import { useDebounce } from "@/shared/presentation/hooks/use-debounce"
import { useAppDispatch, useAppSelector } from "@/shared/presentation/store/hooks"
import { Badge } from "@atoms/badge"
import { Button } from "@atoms/button"
import { Text } from "@atoms/text"
import { StatusBadge } from "@molecules/status-badge"
import { DataTable, type DataTableColumn } from "@organisms/data-table"

import type { MemberType } from "../../domain/member.entity"
import { fetchMembers, selectMemberState, setSearch } from "../store"

const MEMBER_COLUMNS: DataTableColumn<MemberType>[] = [
  {
    key: "member",
    header: "MEMBER",
    render: (member) => (
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {getInitials(member.name)}
        </div>
        <div className="flex flex-col">
          <Text variant="small" className="font-medium text-foreground">
            {member.name}
          </Text>
          <Text variant="caption">{member.email}</Text>
        </div>
      </div>
    ),
  },
  {
    key: "role",
    header: "ROLE/TITLE",
    accessor: "role",
    cellClassName: "text-sm text-foreground",
  },
  {
    key: "department",
    header: "DEPARTMENT",
    render: (member) => (
      <Badge variant="secondary" className="rounded-md px-2.5">
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
        <StatusBadge variant={isActive ? "success" : "muted"}>
          {isActive ? "Active" : "Inactive"}
        </StatusBadge>
      )
    },
  },
  {
    key: "joinDate",
    header: "JOINED DATE",
    cellClassName: "font-mono text-sm text-muted-foreground",
    render: (member) => formatDate(member.joinDate),
  },
  {
    key: "actions",
    header: "ACTIONS",
    headerClassName: "text-right",
    cellClassName: "text-right",
    render: (member) => (
      <div className="inline-flex items-center justify-end gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-primary hover:bg-primary/10 hover:text-primary"
        >
          Edit
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Delete ${member.name}`}
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 />
        </Button>
      </div>
    ),
  },
]

export function MemberList() {
  const dispatch = useAppDispatch()
  const { items, search, isLoading, error } = useAppSelector(selectMemberState)
  const debouncedSearch = useDebounce(search, 1000)

  useEffect(() => {
    void dispatch(fetchMembers(debouncedSearch || undefined))
  }, [dispatch, debouncedSearch])

  return (
    <DataTable
      columns={MEMBER_COLUMNS}
      data={items}
      getRowKey={(member) => member.id}
      isLoading={isLoading}
      error={error}
      loadingMessage="Loading members..."
      emptyMessage="No members found."
      search={{
        value: search,
        onChange: (value) => dispatch(setSearch(value)),
        placeholder: "Search by name, email, or role...",
        ariaLabel: "Search members",
      }}
    />
  )
}
