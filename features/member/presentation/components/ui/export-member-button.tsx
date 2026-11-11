"use client"

import { useEffect } from "react"
import { Download } from "lucide-react"

import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/presentation/store/hooks"
import { Button } from "@atoms/button"

import {
  clearExportError,
  exportMembersCsv,
  selectMemberState,
} from "../../store"

export function ExportMemberButton() {
  const dispatch = useAppDispatch()
  const { isExporting, exportError } = useAppSelector(selectMemberState)

  useEffect(() => {
    return () => {
      dispatch(clearExportError())
    }
  }, [dispatch])

  const handleExport = () => {
    void dispatch(exportMembersCsv())
  }

  return (
    <>
      {exportError && (
        <span role="alert" className="text-xs text-destructive">
          {exportError}
        </span>
      )}
      <Button
        type="button"
        variant="outline"
        disabled={isExporting}
        onClick={handleExport}
      >
        <Download />
        {isExporting ? "Exporting..." : "Export CSV"}
      </Button>
    </>
  )
}
