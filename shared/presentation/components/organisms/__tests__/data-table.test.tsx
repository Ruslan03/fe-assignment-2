import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { DataTable, type DataTableColumn } from "@organisms/data-table"

interface SampleItem {
  id: string
  name: string | null
  category: string
}

const COLUMNS: DataTableColumn<SampleItem>[] = [
  { key: "name", header: "NAME", accessor: "name" },
  {
    key: "category",
    header: "CATEGORY",
    headerClassName: "text-right",
    cellClassName: "text-right",
    render: (row) => <span>[{row.category}]</span>,
  },
  { key: "empty", header: "EMPTY" },
]

const SAMPLE_DATA: SampleItem[] = [
  { id: "1", name: "Alpha", category: "Core" },
  { id: "2", name: null, category: "Plugin" },
]

describe("DataTable", () => {
  it("renders headers, rows via accessor/render, and search input", () => {
    const onSearchChange = vi.fn()

    render(
      <DataTable
        columns={COLUMNS}
        data={SAMPLE_DATA}
        getRowKey={(row) => row.id}
        search={{
          value: "alp",
          onChange: onSearchChange,
          placeholder: "Filter items...",
          ariaLabel: "Filter items",
          icon: <span data-testid="custom-icon">*</span>,
        }}
        toolbar={<button type="button">Export</button>}
      />
    )

    expect(screen.getByText("NAME")).toBeInTheDocument()
    expect(screen.getByText("CATEGORY")).toHaveClass("text-right")
    expect(screen.getByText("Alpha")).toBeInTheDocument()
    expect(screen.getByText("[Plugin]")).toBeInTheDocument()
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument()

    const searchInput = screen.getByRole("searchbox", { name: "Filter items" })
    expect(searchInput).toHaveValue("alp")

    fireEvent.change(searchInput, { target: { value: "beta" } })
    expect(onSearchChange).toHaveBeenCalledWith("beta")
  })

  it("renders without toolbar when search and toolbar are omitted and dims body while reloading", () => {
    const { container } = render(
      <DataTable
        columns={COLUMNS}
        data={SAMPLE_DATA}
        getRowKey={(row) => row.id}
        isLoading
      />
    )

    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument()
    expect(container.querySelector('[data-slot="table-body"]')).toHaveClass(
      "opacity-60"
    )
  })

  it("renders loading, error, and empty states", () => {
    const { rerender } = render(
      <DataTable
        columns={COLUMNS}
        data={[]}
        getRowKey={(row) => row.id}
        isLoading
        loadingMessage="Loading..."
      />
    )
    expect(screen.getByText("Loading...")).toBeInTheDocument()

    rerender(
      <DataTable
        columns={COLUMNS}
        data={[]}
        getRowKey={(row) => row.id}
        error="Something went wrong"
      />
    )
    expect(screen.getByText("Something went wrong")).toBeInTheDocument()

    rerender(
      <DataTable
        columns={COLUMNS}
        data={[]}
        getRowKey={(row) => row.id}
        emptyMessage="Nothing here"
      />
    )
    expect(screen.getByText("Nothing here")).toBeInTheDocument()
  })
})
