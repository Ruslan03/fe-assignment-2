import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Badge } from "@atoms/badge"
import { Dot, type DotProps } from "@atoms/dot"

const statusBadgeVariants = cva(
  "gap-1.5 rounded-xl px-2 py-0.5 text-[11px] leading-[14px] font-semibold",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        success: "bg-status-success text-status-success-foreground",
        warning: "bg-status-warning text-status-warning-foreground",
        destructive: "bg-destructive/10 text-destructive",
        muted: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

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

