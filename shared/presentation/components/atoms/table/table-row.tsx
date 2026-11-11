"use client"

import * as React from "react"
import { cn } from "cn"

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-border/60 transition-colors hover:bg-background/80 has-aria-expanded:bg-background/80 data-[state=selected]:bg-surface-subtle/70",
        className
      )}
      {...props}
    />
  )
}

export { TableRow }

