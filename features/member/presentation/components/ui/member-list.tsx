"use client"

import { useEffect } from "react"
import Link from "next/link"

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
import { StatusBadge } from "@molecules/status-badge"
import { DataTable, type DataTableColumn } from "@organisms/data-table"

import type { MemberType } from "../../../domain/member.entity"
import {
  clearDeleteError,
  fetchMembers,
  selectMemberState,
  setSearch,
} from "../../store"
import { DeleteMemberButton } from "./delete-member-button"

function getMemberDetailHref(id: string): string {
  return `/members/${encodeURIComponent(id)}`
}

const MEMBER_COLUMNS: DataTableColumn<MemberType>[] = [
  {
    key: "member",
    header: "MEMBER",
    render: (member) => (
      <Link
        href={getMemberDetailHref(member.id)}
        className="group flex w-fit items-center gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Avatar variant="soft" shape="circle" size="md" aria-hidden="true">
          {getInitials(member.name)}
        </Avatar>
        <div className="flex flex-col">
          <Text
            variant="small"
            className="font-medium text-foreground transition-colors group-hover:text-primary"
          >
            {member.name}
          </Text>
          <Text variant="caption">{member.email}</Text>
        </div>
      </Link>
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
          variant="ghost"
          size="sm"
          asChild
          className="text-primary hover:bg-primary/10 hover:text-primary"
        >
          <Link href={getMemberDetailHref(member.id)}>Edit</Link>
        </Button>
        <DeleteMemberButton
          member={member}
          variant="ghost"
          size="icon-sm"
          iconOnly
          aria-label={`Delete ${member.name}`}
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        />
      </div>
    ),
  },
]

export function MemberList() {
  const dispatch = useAppDispatch()
  const { items, search, isLoading, error, deleteError } =
    useAppSelector(selectMemberState)
  const debouncedSearch = useDebounce(search, 1000)

  useEffect(() => {
    void dispatch(fetchMembers(debouncedSearch || undefined))
  }, [dispatch, debouncedSearch])

  useEffect(() => {
    return () => {
      dispatch(clearDeleteError())
    }
  }, [dispatch])

  return (
    <>
      {deleteError && (
        <Text
          as="p"
          variant="caption"
          role="alert"
          className="text-destructive"
        >
          {deleteError}
        </Text>
      )}
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
    </>
  )
}
