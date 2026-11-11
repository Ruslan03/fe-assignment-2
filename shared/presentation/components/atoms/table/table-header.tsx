"use client"

import * as React from "react"
import { cn } from "cn"

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b-0", className)}
      {...props}
    />
  )
}

export { TableHeader }

