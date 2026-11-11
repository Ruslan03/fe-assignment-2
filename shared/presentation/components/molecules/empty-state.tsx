import type * as React from "react"
import { cn } from "cn"

import { Text } from "@atoms/text"

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

/** Domain-agnostic centered empty state molecule with icon container, title, description, and optional action. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center px-6 py-16 text-center",
        className
      )}
    >
      {icon && (
        <div
          data-slot="empty-state-icon"
          aria-hidden="true"
          className="mb-4 flex size-12 items-center justify-center rounded-xl bg-surface-tonal text-primary [&_svg]:size-5"
        >
          {icon}
        </div>
      )}

      <Text
        as="p"
        variant="large"
        className="text-base font-semibold text-foreground"
      >
        {title}
      </Text>

      {description && (
        <Text
          as="p"
          variant="muted"
          className="mt-1.5 max-w-md text-xs leading-relaxed text-muted-foreground"
        >
          {description}
        </Text>
      )}

      {action && (
        <div data-slot="empty-state-action" className="mt-5">
          {action}
        </div>
      )}
    </div>
  )
}

