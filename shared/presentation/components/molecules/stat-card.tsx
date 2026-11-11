import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Badge } from "@atoms/badge"
import { Card, CardContent } from "@atoms/card"
import { Text } from "@atoms/text"

const statCardIconVariants = cva(
  "flex size-9 shrink-0 items-center justify-center rounded-lg [&_svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        info: "bg-sky-500/10 text-sky-600",
        muted: "bg-secondary text-muted-foreground",
        warning: "bg-amber-500/10 text-amber-600",
        success: "bg-emerald-500/10 text-emerald-600",
        destructive: "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const statCardBadgeVariants = cva("rounded-md font-medium", {
  variants: {
    variant: {
      default: "bg-primary/10 text-primary",
      info: "bg-sky-500/10 text-sky-700",
      muted: "bg-secondary text-muted-foreground",
      warning: "bg-amber-500/10 text-amber-700",
      success: "bg-emerald-500/10 text-emerald-700",
      destructive: "bg-destructive/10 text-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

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
    <Card size="sm" className={cn("justify-between py-5", className)}>
      <CardContent className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <Text
            as="span"
            variant="caption"
            className="font-semibold tracking-wider uppercase"
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
          className="text-3xl font-bold tracking-tight text-foreground"
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
