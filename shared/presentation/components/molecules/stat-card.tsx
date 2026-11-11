import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Badge } from "@atoms/badge"
import { Card, CardContent } from "@atoms/card"
import { Text } from "@atoms/text"

const statCardIconVariants = cva(
  "flex size-8 shrink-0 items-center justify-center rounded-sm [&_svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-surface-subtle text-primary",
        info: "bg-surface-subtle text-info",
        muted: "bg-surface-subtle text-muted-foreground",
        warning: "bg-surface-subtle text-status-warning-dot",
        success: "bg-status-success text-status-success-dot",
        destructive: "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const statCardBadgeVariants = cva(
  "rounded-xl px-2 py-0.5 text-[11px] leading-[14px] font-semibold",
  {
    variants: {
      variant: {
        default: "bg-surface-tonal text-primary",
        info: "bg-info-surface text-info",
        muted: "bg-surface-tonal text-muted-foreground",
        warning: "bg-status-warning text-status-warning-dot",
        success: "bg-status-success text-status-success-foreground",
        destructive: "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface StatCardProps extends VariantProps<
  typeof statCardIconVariants
> {
  label: string
  value: React.ReactNode
  badge?: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

/** Domain-agnostic KPI statistic card molecule combining Card, Text, Badge, and an optional icon badge. */
export function StatCard({
  label,
  value,
  badge,
  icon,
  variant = "default",
  className,
}: StatCardProps) {
  return (
    <Card size="sm" className={cn("justify-between p-4", className)}>
      <CardContent className="gap-2 p-0">
        <div className="flex items-center justify-between gap-3">
          <Text
            as="span"
            variant="caption"
            className="text-[11px] leading-[14px] font-medium tracking-wider text-muted-foreground uppercase"
          >
            {label}
          </Text>
          {icon && (
            <div
              data-slot="stat-card-icon"
              data-variant={variant}
              className={statCardIconVariants({ variant })}
            >
              {icon}
            </div>
          )}
        </div>

        <Text
          as="p"
          variant="h2"
          className="text-[32px] leading-10 font-semibold tracking-tight text-foreground"
        >
          {value}
        </Text>

        {badge && (
          <Badge
            variant="secondary"
            data-slot="stat-card-badge"
            data-variant={variant}
            className={statCardBadgeVariants({ variant })}
          >
            {badge}
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}

export { statCardIconVariants, statCardBadgeVariants }
