import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Badge } from "@atoms/badge"
import { Dot, type DotProps } from "@atoms/dot"

const statusBadgeVariants = cva("gap-1.5 px-2.5", {
  variants: {
    variant: {
      default: "bg-primary/10 text-primary",
      success: "bg-emerald-500/10 text-emerald-600",
      warning: "bg-amber-500/10 text-amber-600",
      destructive: "bg-destructive/10 text-destructive",
      muted: "bg-muted text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface StatusBadgeProps
  extends Omit<React.ComponentProps<typeof Badge>, "variant">,
    VariantProps<typeof statusBadgeVariants> {
  dotSize?: DotProps["size"]
  dotClassName?: string
}

/** Molecule combining Badge and Dot atoms to display a semantic status pill. */
export function StatusBadge({
  variant = "default",
  dotSize = "sm",
  dotClassName,
  className,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      data-slot="status-badge"
      data-variant={variant}
      className={cn(statusBadgeVariants({ variant }), className)}
      {...props}
    >
      <Dot variant={variant} size={dotSize} className={dotClassName} />
      {children}
    </Badge>
  )
}

export { statusBadgeVariants }

