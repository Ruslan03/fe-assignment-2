'use client'

import type * as React from "react"
import { cn } from "cn"
import { Search } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@atoms/table"
import { IconInput } from "@molecules/icon-input"

export interface DataTableColumn<TData> {
  key: string
  header: React.ReactNode
  headerClassName?: string
  cellClassName?: string
  accessor?: keyof TData
  render?: (row: TData, index: number) => React.ReactNode
}

export interface DataTableSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  ariaLabel?: string
  icon?: React.ReactNode
  containerClassName?: string
}

export interface DataTableProps<TData> {
  columns: DataTableColumn<TData>[]
  data: TData[]
  getRowKey: (row: TData, index: number) => React.Key
  search?: DataTableSearchProps
  toolbar?: React.ReactNode
  isLoading?: boolean
  error?: string | null
  loadingMessage?: React.ReactNode
  emptyMessage?: React.ReactNode
  className?: string
}

function renderCellContent<TData>(
  column: DataTableColumn<TData>,
  row: TData,
  index: number
): React.ReactNode {
  if (column.render) return column.render(row, index)
  if (column.accessor !== undefined) {
    const value = row[column.accessor]
    return value == null ? null : String(value)
  }
  return null
}

function renderStatusRow(
  colSpan: number,
  content: React.ReactNode,
  className: string
) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell
        colSpan={colSpan}
        className={cn("px-4 py-8 text-center text-sm", className)}
      >
        {content}
      </TableCell>
    </TableRow>
  )
}

/** Generic reusable data table organism supporting custom columns, optional search/toolbar, and status states. */
export function DataTable<TData>({
  columns,
  data,
  getRowKey,
  search,
  toolbar,
  isLoading = false,
  error = null,
  loadingMessage = "Loading data...",
  emptyMessage = "No data found.",
  className,
}: DataTableProps<TData>) {
  const showToolbar = Boolean(search || toolbar)

  const renderBody = () => {
    if (isLoading && data.length === 0) {
      return renderStatusRow(
        columns.length,
        loadingMessage,
        "text-muted-foreground"
      )
    }

    if (error) {
      return renderStatusRow(columns.length, error, "text-destructive")
    }

    if (data.length === 0) {
      return renderStatusRow(
        columns.length,
        emptyMessage,
        "text-muted-foreground"
      )
    }

    return data.map((row, rowIndex) => (
      <TableRow key={getRowKey(row, rowIndex)}>
        {columns.map((column) => (
          <TableCell
            key={column.key}
            className={cn("px-4 py-3", column.cellClassName)}
          >
            {renderCellContent(column, row, rowIndex)}
          </TableCell>
        ))}
      </TableRow>
    ))
  }

  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card shadow-xs",
        className
      )}
    >
      {showToolbar && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4">
          {search && (
            <IconInput
              icon={search.icon ?? <Search />}
              type="search"
              placeholder={search.placeholder ?? "Search..."}
              aria-label={search.ariaLabel ?? "Search"}
              containerClassName={cn("max-w-sm", search.containerClassName)}
              value={search.value}
              onChange={(event) => search.onChange(event.target.value)}
            />
          )}
          {toolbar}
        </div>
      )}

      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  "px-4 py-3 text-xs font-semibold tracking-wider text-muted-foreground",
                  column.headerClassName
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody
          className={cn(
            isLoading && data.length > 0 && "opacity-60 transition-opacity"
          )}
        >
          {renderBody()}
        </TableBody>
      </Table>
    </section>
  )
}

