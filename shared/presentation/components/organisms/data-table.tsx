"use client"

import type * as React from "react"
import { cn } from "cn"
import { Search } from "lucide-react"

import { Checkbox } from "@atoms/checkbox"
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
  onClear?: () => void
  clearLabel?: string
  placeholder?: string
  ariaLabel?: string
  icon?: React.ReactNode
  className?: string
  containerClassName?: string
}

export interface DataTableSelectionProps<TData> {
  selectedKeys: React.Key[]
  onChange: (keys: React.Key[]) => void
  getRowLabel?: (row: TData, index: number) => string
  selectAllLabel?: string
}

export interface DataTableProps<TData> {
  columns: DataTableColumn<TData>[]
  data: TData[]
  getRowKey: (row: TData, index: number) => React.Key
  search?: DataTableSearchProps
  toolbar?: React.ReactNode
  selection?: DataTableSelectionProps<TData>
  isLoading?: boolean
  error?: string | null
  loadingMessage?: React.ReactNode
  emptyMessage?: React.ReactNode
  emptyState?: React.ReactNode
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
  selection,
  isLoading = false,
  error = null,
  loadingMessage = "Loading data...",
  emptyMessage = "No data found.",
  emptyState,
  className,
}: DataTableProps<TData>) {
  const showToolbar = Boolean(search || toolbar)
  const showEmptyState =
    !isLoading && !error && data.length === 0 && Boolean(emptyState)
  const totalColumns = columns.length + (selection ? 1 : 0)
  const selectedKeySet = new Set(selection?.selectedKeys ?? [])
  const rowKeys = data.map((row, rowIndex) => getRowKey(row, rowIndex))
  const selectedCountInView = rowKeys.filter((key) =>
    selectedKeySet.has(key)
  ).length
  const allSelected =
    rowKeys.length > 0 && selectedCountInView === rowKeys.length
  const someSelected = selectedCountInView > 0 && !allSelected

  const handleToggleAll = () => {
    if (!selection) return

    if (allSelected) {
      const viewKeySet = new Set(rowKeys)
      selection.onChange(
        selection.selectedKeys.filter((key) => !viewKeySet.has(key))
      )
      return
    }

    const merged = new Set(selection.selectedKeys)
    rowKeys.forEach((key) => merged.add(key))
    selection.onChange(Array.from(merged))
  }

  const handleToggleRow = (key: React.Key) => {
    if (!selection) return

    if (selectedKeySet.has(key)) {
      selection.onChange(
        selection.selectedKeys.filter((selectedKey) => selectedKey !== key)
      )
      return
    }

    selection.onChange([...selection.selectedKeys, key])
  }

  const renderBody = () => {
    if (isLoading && data.length === 0) {
      return renderStatusRow(
        totalColumns,
        loadingMessage,
        "text-muted-foreground"
      )
    }

    if (error) {
      return renderStatusRow(totalColumns, error, "text-destructive")
    }

    if (data.length === 0) {
      return renderStatusRow(
        totalColumns,
        emptyMessage,
        "text-muted-foreground"
      )
    }

    return data.map((row, rowIndex) => {
      const rowKey = getRowKey(row, rowIndex)
      const isSelected = Boolean(selection && selectedKeySet.has(rowKey))

      return (
        <TableRow
          key={rowKey}
          data-state={isSelected ? "selected" : undefined}
          className="h-16"
        >
          {selection && (
            <TableCell className="w-10 px-4 py-3">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => handleToggleRow(rowKey)}
                aria-label={
                  selection.getRowLabel
                    ? selection.getRowLabel(row, rowIndex)
                    : `Select row ${rowIndex + 1}`
                }
              />
            </TableCell>
          )}
          {columns.map((column) => (
            <TableCell
              key={column.key}
              className={cn("px-4 py-3", column.cellClassName)}
            >
              {renderCellContent(column, row, rowIndex)}
            </TableCell>
          ))}
        </TableRow>
      )
    })
  }

  return (
    <section
      className={cn(
        "overflow-hidden rounded-lg bg-card shadow-xs ring-1 ring-border/60",
        className
      )}
    >
      {showToolbar && (
        <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4">
          {search && (
            <IconInput
              icon={search.icon ?? <Search />}
              type="search"
              placeholder={search.placeholder ?? "Search..."}
              aria-label={search.ariaLabel ?? "Search"}
              className={cn("border-border/80", search.className)}
              containerClassName={cn("max-w-md", search.containerClassName)}
              value={search.value}
              onChange={(event) => search.onChange(event.target.value)}
              onClear={search.onClear}
              clearLabel={search.clearLabel}
            />
          )}
          {toolbar}
        </div>
      )}

      {showEmptyState ? (
        emptyState
      ) : (
        <Table>
          <TableHeader className="bg-surface-subtle">
            <TableRow className="hover:bg-transparent">
              {selection && (
                <TableHead className="w-10 px-4 py-3">
                  <Checkbox
                    checked={
                      allSelected ? true : someSelected ? "indeterminate" : false
                    }
                    disabled={data.length === 0}
                    onCheckedChange={handleToggleAll}
                    aria-label={selection.selectAllLabel ?? "Select all rows"}
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-[11px] font-semibold tracking-wider text-muted-foreground",
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
      )}
    </section>
  )
}
